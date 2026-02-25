import { authorize } from "@/helpers/authorize";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


//get artist by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { authorized, user } = authorize(req, ["artist_manager"]);
        if (!authorized || !user) {
            return NextResponse.json({ error: "Forbidden to view artist" }, { status: 403 });
        }
        if (!id) {
            return NextResponse.json({ error: "Artist ID is required" }, { status: 400 });
        }
        if (id !== user.id) {
            return NextResponse.json({ error: "You can only view your artist's profile" }, { status: 403 });
        }
        const artist = await pool.query(`SELECT id, name, email,gender, dob, address, first_release_year, no_of_albums_released FROM users WHERE id = $1 AND role = 'artist'`, [id]);
        if (artist.rows.length === 0) {
            return NextResponse.json({ error: "Artist not found" }, { status: 404 });
        }
        return NextResponse.json(artist.rows[0]);

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch artist" }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { authorized, user } = authorize(req, ["artist_manager"]);
        if (!authorized || !user) {
            return NextResponse.json({ error: "Forbidden to delete artist" }, { status: 403 });
        }

        if (!id) {
            return NextResponse.json({ error: "Artist ID is required" }, { status: 400 });
        }

        if (id === user.id) {
            return NextResponse.json({ error: "You must be his artist_manager to delete an artist" }, { status: 403 });
        }

        const artist = await pool.query(`SELECT id FROM users WHERE id = $1 AND role = 'artist'`, [id]);
        if (artist.rows.length === 0) {
            return NextResponse.json({ error: "Artist not found" }, { status: 404 });
        }
        await pool.query(`DELETE FROM users WHERE id = $1 AND role = 'artist'`, [id]);
        return NextResponse.json({ message: "Artist deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete artist" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { authorized, user } = authorize(req, ["artist_manager", "artist"]);
        if (!authorized || !user) return NextResponse.json({ error: "Forbidden to update artist" }, { status: 403 });

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Artist ID is required" }, { status: 400 });
        }

        if (id !== user.id) {
            return NextResponse.json({ error: "You can only update your own profile" }, { status: 403 });
        }

        const body = await req.json();

        const artistExists = await pool.query(`SELECT id FROM users WHERE id = $1 AND role = 'artist'`, [id]);
        if (artistExists.rows.length === 0) {
            return NextResponse.json({ error: "Artist not found" }, { status: 404 });
        }

        // 2. Build dynamic query
        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(body)) {
            // Filter out keys that shouldn't be updated or are undefined
            if (value !== undefined && key !== 'id') {
                fields.push(`${key} = $${index}`);
                values.push(value);
                index++;
            }
        }

        if (fields.length === 0) {
            return NextResponse.json({ message: "No changes detected" });
        }

        // 3. Add ID to the end of values array
        values.push(id);
        const query = `
            UPDATE users 
            SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $${index}
        `;

        await pool.query(query, values);

        return NextResponse.json({ message: "Artist updated successfully" });

    } catch (error: any) {
        // 4. Specific handle for Duplicate Email (Postgres error code 23505)
        if (error.code === '23505') {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }
        console.error(error);
        return NextResponse.json({ error: "Failed to update artist" }, { status: 500 });
    }
}