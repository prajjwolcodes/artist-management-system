import { authorize } from "@/helpers/authorize";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
        const musicResult = await pool.query(
            `SELECT id FROM music WHERE id = $1 AND artist_id = $2`,
            [id, user.id]
        );
        if (musicResult.rows.length === 0) {
            return NextResponse.json({ error: "Music not found or access denied" }, { status: 404 });
        }
        await pool.query(
            `DELETE FROM music WHERE id = $1`,
            [id]
        );
        return NextResponse.json({ message: "Music deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete music" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { authorized, user } = authorize(req, ["artist"]);
        if (!authorized || !user) {
            return NextResponse.json({ error: "Forbidden to perform this action" }, { status: 403 });
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Music ID is required" }, { status: 400 });
        }
        const { title, album_name, genre } = await req.json();
        if (!title || !genre || !album_name) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }
        // Ensure the music belongs to the artist
        const musicResult = await pool.query(
            `SELECT id FROM music WHERE id = $1 AND artist_id = $2`,
            [id, user.id]
        );
        if (musicResult.rows.length === 0) {
            return NextResponse.json({ error: "Music not found or access denied" }, { status: 404 });
        }
        await pool.query(
            `UPDATE music SET title = $1, album_name = $2, genre = $3 WHERE id = $4`,
            [title, album_name, genre, id]
        );
        return NextResponse.json({ message: "Music updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update music" }, { status: 500 });
    }
}