import { authorize } from "@/helpers/authorize";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendActivationEmail } from "@/lib/mail";
import crypto from "crypto";


//get all users
export async function GET(req: NextRequest) {
    try {
        const { authorized } = authorize(req, ["super_admin"]);
        if (!authorized) {
            return NextResponse.json({ error: "Forbidden to perform this action" }, { status: 403 });
        }

        const { searchParams } = req.nextUrl;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = (page - 1) * limit;

        const users = await pool.query(`
            SELECT id, first_name, last_name, email, role,phone,dob,address,is_active FROM users
            LIMIT $1 OFFSET $2
            `, [limit, offset]);

        const totalResult = await pool.query(
            `SELECT COUNT(*) FROM users`
        );

        const total = parseInt(totalResult.rows[0].count);
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            users: users.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}


// create user - send activation email with password setup link
export async function POST(req: NextRequest) {
    try {
        const { authorized, user } = authorize(req, ["super_admin", "artist_manager",]);

        if (!authorized || !user) {
            return NextResponse.json({ error: "Forbidden to perform this action" }, { status: 403 });
        }

        const body = await req.json();
        const { email, role } = body;

        if (!email || !role) {
            return NextResponse.json(
                { error: "Email and role required" },
                { status: 400 }
            );
        }

        // 🔥 Hierarchy enforcement
        if (user.role === "artist_manager" && role !== "artist") {
            return NextResponse.json(
                { error: "Managers can only create artists" },
                { status: 403 }
            );
        }

        // Check existing user
        const existing = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existing.rows.length > 0) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Insert user
        await pool.query(`
            INSERT INTO users 
            (email, role, activation_token, activation_expires, is_active)
            VALUES ($1, $2, $3, $4, false)`,
            [email, role, token, expires]
        );

        const activationLink = `${process.env.NEXT_PUBLIC_APP_URL}/activate?token=${token}`;

        await sendActivationEmail(email, activationLink);

        return NextResponse.json({
            message: "User created. Activation email sent.",
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}
