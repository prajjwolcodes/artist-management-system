import { authorize } from "@/helpers/authorize";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


// create a new song for an artist / only artist can create music
export async function POST(req: NextRequest) {
    const client = await pool.connect();
    try {
        const { authorized, user } = authorize(req, ["artist"]);
        if (!authorized || !user) {
            return NextResponse.json({ error: "Forbidden to perform this action" }, { status: 403 });
        }
        const { title, album_name, genre, createdAt } = await req.json();

        if (!title || !genre || !album_name) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        await client.query("BEGIN");

        if (createdAt) {
            await client.query(
                `INSERT INTO music (title, album_name, genre, artist_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
                [title, album_name, genre, user.id, createdAt]
            );
        } else {
            await client.query(
                `INSERT INTO music (title, album_name, genre, artist_id) VALUES ($1, $2, $3, $4)`,
                [title, album_name, genre, user.id]
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
        return NextResponse.json({ message: "Music created successfully" }, { status: 201 });
    } catch (error) {
        await client.query("ROLLBACK");
        console.log(error)
        return NextResponse.json({ error: "Failed to create music" }, { status: 500 });
    } finally {
        client.release();
    }
}


// get all music
export async function GET(req: NextRequest) {
    try {
        const { authorized, user } = authorize(req, ["artist_manager", "super_admin", "artist"]);
        if (!authorized || !user) {
            return NextResponse.json({ error: "Forbidden to view music" }, { status: 403 });
        }

        // Extract pagination parameters from query string
        const url = new URL(req.url);
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
        const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit") || "10", 10)));
        const artistId = url.searchParams.get("artist_id");

        const offset = (page - 1) * limit;

        // Build where clause based on role
        let whereClause = "";
        let queryParams: any[] = [];

        if (user.role === "artist_manager") {
            whereClause = "WHERE a.artist_manager_id = $1";
            queryParams = [user.id];

            // Add artist filter if provided
            if (artistId) {
                whereClause += ` AND a.user_id = $${queryParams.length + 1}`;
                queryParams.push(artistId);
            }
        } else if (user.role === "artist") {
            whereClause = "WHERE a.user_id = $1";
            queryParams = [user.id];
        } else if (user.role === "super_admin") {
            // super_admin can filter by artist if provided
            if (artistId) {
                whereClause = "WHERE a.user_id = $1";
                queryParams = [artistId];
            }
        }

        // Get total count of music
        const countResult = await pool.query(
            `SELECT COUNT(*) as total FROM music m
             JOIN artists a ON m.artist_id = a.user_id
             ${whereClause}`,
            queryParams
        );
        const total = parseInt(countResult.rows[0].total, 10);

        // Get paginated music with artist details
        const music = await pool.query(
            `SELECT m.id, m.title, m.album_name, m.genre, 
                    a.user_id as artist_id, CONCAT(u.first_name, ' ', u.last_name) as artist_name, u.email as artist_email,
                    m.created_at
             FROM music m
             JOIN artists a ON m.artist_id = a.user_id
             JOIN users u ON a.user_id = u.id
             ${whereClause}
             ORDER BY m.created_at DESC
             LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
            [...queryParams, limit, offset]
        );

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            music: music.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch music" }, { status: 500 });
    }
}