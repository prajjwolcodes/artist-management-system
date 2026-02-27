import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const { token, first_name, last_name, dob, address, gender, phone, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // 🔎 Find user by activation token
        const result = await pool.query(
            `SELECT id, role, activation_expires 
            FROM users 
            WHERE activation_token = $1
            `,
            [token]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "Invalid activation token" },
                { status: 400 }
            );
        }

        const user = result.rows[0];

        // ⏳ Check token expiration
        if (new Date() > new Date(user.activation_expires)) {
            return NextResponse.json(
                { error: "Activation token expired" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Activate user
        await pool.query(
            `
      UPDATE users
      SET password = $1,
          is_active = true,
          activation_token = NULL,
          activation_expires = NULL,
          first_name = $3,
          last_name = $4,
          dob = $5,
          address = $6,
          gender = $7,
          phone = $8,
          profile_complete = true
      WHERE id = $2
      `,
            [hashedPassword, user.id, first_name, last_name, dob, address, gender, phone]
        );



        const response = NextResponse.json({
            message: "Account activated successfully, you can now log in",
        });


        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to set password" },
            { status: 500 }
        );
    }
}