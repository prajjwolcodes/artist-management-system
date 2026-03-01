import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { authorize } from "@/helpers/authorize";
import { sendActivationEmail } from "@/lib/mail";
import crypto from "crypto";


// create artist
export async function POST(req: NextRequest) {
    const client = await pool.connect();

    try {
        const { authorized, user } = authorize(req, ["artist_manager"]);

        if (!authorized || !user) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { email, name } = await req.json();

        if (!email || !name) {
            return NextResponse.json(
                { error: "Email and name required" },
                { status: 400 }
            );
        }

        await client.query("BEGIN");

        // ✅ Ensure manager really is artist_manager
        const managerCheck = await client.query(
            `SELECT id FROM users WHERE id = $1 AND role = 'artist_manager'`,
            [user.id]
        );

        if (managerCheck.rows.length === 0) {
            await client.query("ROLLBACK");
            return NextResponse.json(
                { error: "Invalid manager account" },
                { status: 403 }
            );
        }

        const existing = await client.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        );

        if (existing.rows.length > 0) {
            await client.query("ROLLBACK");
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // 👤 Create artist login user
        const newUser = await client.query(
            `
      INSERT INTO users 
      (email, role, activation_token, activation_expires, is_active)
      VALUES ($1, 'artist', $2, $3, false)
      RETURNING id
      `,
            [email, token, expires]
        );

        const artistUserId = newUser.rows[0].id;

        // 🎵 Create artist business profile
        await client.query(
            `
      INSERT INTO artists
      (user_id, artist_manager_id, name)
      VALUES ($1, $2, $3)
      `,
            [artistUserId, user.id, name]
        );

        await client.query("COMMIT");

        const activationLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/activate/artist?token=${token}`;
        await sendActivationEmail(email, activationLink);

        return NextResponse.json({
            message: "Artist created successfully. Activation email sent."
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return NextResponse.json(
            { error: "Failed to create artist" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}

// get all artists for the logged in artist_manager with pagination
// super_admin can see all artists, artist_manager can only see their own artists
export async function GET(req: NextRequest) {
    try {
        const { authorized, user } = authorize(req, ["artist_manager", "super_admin"]);
        if (!authorized || !user) {
            return NextResponse.json({ error: "Forbidden to view artists" }, { status: 403 });
        }

        // Extract pagination parameters from query string
        const url = new URL(req.url);
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
        const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit") || "10", 10)));

        const offset = (page - 1) * limit;

        // Build where clause based on role
        let whereClause = "";
        let queryParams: any[] = [user.id];

        if (user.role === "artist_manager") {
            whereClause = "WHERE a.artist_manager_id = $1";
        } else if (user.role === "super_admin") {
            whereClause = "";
            queryParams = [];
        }

        // Get total count of artists
        const countResult = await pool.query(
            `SELECT COUNT(*) as total FROM users u JOIN artists a ON u.id = a.user_id ${whereClause}`,
            queryParams
        );
        const total = parseInt(countResult.rows[0].total, 10);

        // Get paginated artists
        const artists = await pool.query(
            `SELECT 
                u.id,
                CONCAT(u.first_name, ' ', u.last_name) as name,
                u.email,
                u.gender,
                u.dob,
                u.address,
                COALESCE(MIN(EXTRACT(YEAR FROM m.created_at))::int, 0) as first_release_year,
                COALESCE(COUNT(DISTINCT NULLIF(TRIM(m.album_name), ''))::int, 0) as no_of_albums_released,
                u.is_active,
                a.artist_manager_id,
                a.id as artist_id,
                (SELECT CONCAT(first_name, ' ', last_name) FROM users WHERE id = a.artist_manager_id) as manager_name,
                u.created_at,
                COALESCE(COUNT(m.id), 0) as music_count
             FROM users u 
             JOIN artists a ON u.id = a.user_id
             LEFT JOIN music m ON m.artist_id = a.user_id
             ${whereClause}
             GROUP BY u.id, a.id
             ORDER BY u.created_at DESC
             LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
            [...queryParams, limit, offset]
        );

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            artists: artists.rows,
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
        return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
    }
}

