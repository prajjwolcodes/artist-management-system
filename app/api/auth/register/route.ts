import { pool } from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";
import { NextResponse } from "next/server";

const registerSchema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    dob: z.string().optional(), address: z.string().optional(),
    gender: z.enum(["m", "f", "o"]).optional(),
    role: z.enum(["super_admin", "artist_manager", "artist"]).optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { first_name, last_name, email, password, phone, dob, address, gender, role,
        } = parsed.data;

        const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

        if (existingUser.rows.length > 0) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userCount = await pool.query("SELECT COUNT(*) FROM users");

        const finalRole =
            parseInt(userCount.rows[0].count) === 0
                ? "super_admin"
                : role || "artist";

        const finalIsActive = finalRole === "super_admin" ? true : false;
        await pool.query(`INSERT INTO users (first_name, last_name, email, password, phone, dob, address, gender, role, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [first_name, last_name, email, hashedPassword, phone, dob, address, gender, finalRole, finalIsActive]);

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 }
        );

    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}