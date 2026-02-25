import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
    const client = await pool.connect();

    try {
        const { token, password, name, dob, gender, address, first_release_year, no_of_albums_released
        } = await req.json();

        if (
            !token ||
            !password ||
            !name ||
            !dob ||
            !gender ||
            !address
        ) {
            return NextResponse.json(
                { error: "All required fields must be provided" },
                { status: 400 }
            );
        }

        await client.query("BEGIN");

        // 1️⃣ Find user by token
        const userResult = await client.query(
            `
      SELECT id, activation_expires, is_active
      FROM users
      WHERE activation_token = $1
      AND role = 'artist'
      `,
            [token]
        );

        if (userResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return NextResponse.json(
                { error: "Invalid activation token" },
                { status: 400 }
            );
        }

        const user = userResult.rows[0];

        if (user.is_active) {
            await client.query("ROLLBACK");
            return NextResponse.json(
                { error: "Account already activated" },
                { status: 400 }
            );
        }

        if (new Date(user.activation_expires) < new Date()) {
            await client.query("ROLLBACK");
            return NextResponse.json(
                { error: "Activation token expired" },
                { status: 400 }
            );
        }

        // 2️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3️⃣ Update users table
        await client.query(
            `
      UPDATE users
      SET 
        first_name = $1,
        last_name = $2,
        password = $3,
        dob = $4,
        gender = $5,
        address = $6,
        is_active = true,
        profile_complete = true,
        activation_token = NULL,
        activation_expires = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      `,
            [
                name.split(" ")[0],
                name.split(" ").slice(1).join(" "),
                hashedPassword,
                dob,
                gender,
                address,
                user.id
            ]
        );

        // 4️⃣ Update artist profile
        await client.query(
            `
      UPDATE artists
      SET
        name = $1,
        dob = $2,
        gender = $3,
        address = $4,
        first_release_year = $5,
        no_of_albums_released = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $7
      `,
            [
                name,
                dob,
                gender,
                address,
                first_release_year || null,
                no_of_albums_released || 0,
                user.id
            ]
        );

        await client.query("COMMIT");

        return NextResponse.json({
            message: "Account activated successfully and logged in",
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return NextResponse.json(
            { error: "Activation failed" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}