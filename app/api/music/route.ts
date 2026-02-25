import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, genre, release_date, artist_id } = await req.json();

        if (!name || !genre || !release_date || !artist_id) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }
        await pool.query(
            `INSERT INTO music (name, genre, release_date, artist_id) VALUES ($1, $2, $3, $4)`,
            [name, genre, release_date, artist_id]
        );
        return NextResponse.json({ message: "Music created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create music" }, { status: 500 });
    }
}