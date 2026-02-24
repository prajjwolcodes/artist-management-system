import { authorize } from "@/helpers/authorize";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

//delete user by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { authorized } = authorize(req, ["super_admin"]);
        if (!authorized) {
            return NextResponse.json({ error: "Forbidden to perform this action" }, { status: 403 });
        }
        const { id } = await params;
        console.log(id)
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const user = await pool.query(`SELECT id FROM users WHERE id = $1`, [id]);
        if (user.rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
