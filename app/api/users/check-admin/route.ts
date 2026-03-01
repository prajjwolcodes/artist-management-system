import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const admin = await pool.query(`SELECT id FROM users WHERE role = 'super_admin' AND email != $1 LIMIT 1`, [process.env.TEST_ADMIN_EMAIL]);

        return NextResponse.json({ exists: admin.rows.length > 0 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to check admin status" }, { status: 500 });
    }
}