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

        // Check if super_admin already exists
        console.log(process.env.TEST_ADMIN_EMAIL);
        const superAdminExists = await pool.query("SELECT id FROM users WHERE role = 'super_admin' AND email != $1 LIMIT 1", [process.env.TEST_ADMIN_EMAIL]);

        if (superAdminExists.rows.length > 0) {
            return NextResponse.json(
                { error: "Registration is currently closed. Please use the provided test credentials." },
                { status: 403 }
            );
        }

        const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

        if (existingUser.rows.length > 0) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the first user as super_admin
        const finalRole = "super_admin";
        const finalIsActive = true;
        const isProfileComplete = true;

        await pool.query(`INSERT INTO users (first_name, last_name, email, password, phone, dob, address, gender, role, is_active, profile_complete) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`, [first_name, last_name, email, hashedPassword, phone, dob, address, gender, finalRole, finalIsActive, isProfileComplete]);

        return NextResponse.json({ message: "Super Admin account created successfully!" }, { status: 201 }
        );

    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}