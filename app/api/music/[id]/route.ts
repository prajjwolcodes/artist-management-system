import { authorize } from "@/helpers/authorize";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const client = await pool.connect();
    try {
        const { authorized, user } = authorize(req, ["artist"]);
        if (!authorized || !user) {
            return NextResponse.json({ error: "Forbidden to perform this action" }, { status: 403 });
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Music ID is required" }, { status: 400 });
        }
        // Ensure the music belongs to the artist
        const musicResult = await client.query(
            `SELECT id FROM music WHERE id = $1 AND artist_id = $2`,
            [id, user.id]
        );
        if (musicResult.rows.length === 0) {
            return NextResponse.json({ error: "Music not found or access denied" }, { status: 404 });
        }

        await client.query("BEGIN");

        await client.query(
            `DELETE FROM music WHERE id = $1`,
            [id]
        );

        await client.query(
            `UPDATE artists
             SET first_release_year = COALESCE((SELECT MIN(EXTRACT(YEAR FROM created_at))::int FROM music WHERE artist_id = $1), 0),
                 no_of_albums_released = COALESCE((SELECT COUNT(DISTINCT NULLIF(TRIM(album_name), ''))::int FROM music WHERE artist_id = $1), 0),
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $1`,
            [user.id]
        );

        await client.query("COMMIT");
        return NextResponse.json({ message: "Music deleted successfully" }, { status: 200 });
    } catch (error) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "Failed to delete music" }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const client = await pool.connect();
    try {
        const { authorized, user } = authorize(req, ["artist"]);
        if (!authorized || !user) {
            return NextResponse.json({ error: "Forbidden to perform this action" }, { status: 403 });
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Music ID is required" }, { status: 400 });
        }
        const { title, album_name, genre, createdAt } = await req.json();
        if (!title || !genre || !album_name) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }
        // Ensure the music belongs to the artist
        const musicResult = await client.query(
            `SELECT id FROM music WHERE id = $1 AND artist_id = $2`,
            [id, user.id]
        );
        if (musicResult.rows.length === 0) {
            return NextResponse.json({ error: "Music not found or access denied" }, { status: 404 });
        }

        await client.query("BEGIN");

        if (createdAt) {
            await client.query(
                `UPDATE music SET title = $1, album_name = $2, genre = $3, created_at = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5`,
                [title, album_name, genre, createdAt, id]
            );
        } else {
            await client.query(
                `UPDATE music SET title = $1, album_name = $2, genre = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
                [title, album_name, genre, id]
            );
        }

        await client.query(
            `UPDATE artists
             SET first_release_year = COALESCE((SELECT MIN(EXTRACT(YEAR FROM created_at))::int FROM music WHERE artist_id = $1), 0),
                 no_of_albums_released = COALESCE((SELECT COUNT(DISTINCT NULLIF(TRIM(album_name), ''))::int FROM music WHERE artist_id = $1), 0),
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $1`,
            [user.id]
        );

        await client.query("COMMIT");
        return NextResponse.json({ message: "Music updated successfully" }, { status: 200 });
    } catch (error) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "Failed to update music" }, { status: 500 });
    } finally {
        client.release();
    }
}