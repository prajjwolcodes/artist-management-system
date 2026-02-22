import { pool } from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";
import { NextResponse } from "next/server";
import { generateToken } from "@/lib/generateToken";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { email, password } = parsed.data;

        const existingUser = await pool.query("SELECT id, password,role FROM users WHERE email = $1", [email]);

        if (existingUser.rows.length === 0) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        const checkPassword = await bcrypt.compare(password, existingUser.rows[0].password);

        if (!checkPassword) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        const token = generateToken({ id: existingUser.rows[0].id, email, role: existingUser.rows[0].role });

        const response = NextResponse.json({ message: "User logged in successfully", role: existingUser.rows[0].role, token }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });


        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
