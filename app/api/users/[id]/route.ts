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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { authorized } = authorize(req, ["super_admin"]);
        if (!authorized) {
            return NextResponse.json({ error: "Forbidden to perform this action" }, { status: 403 });
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const user = await pool.query(`SELECT id, first_name, last_name, email, phone, dob, gender, address, role, is_active, created_at, updated_at FROM users WHERE id = $1`, [id]);
        if (user.rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { authorized } = authorize(req, ["super_admin"]);
        if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id } = await params;
        const body = await req.json();

        const userExists = await pool.query(`SELECT id FROM users WHERE id = $1`, [id]);
        if (userExists.rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. Build dynamic query
        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(body)) {
            // Filter out keys that shouldn't be updated or are undefined
            if (value !== undefined && key !== 'id') {
                fields.push(`${key} = $${index}`);
                values.push(value);
                index++;
            }
        }

        if (fields.length === 0) {
            return NextResponse.json({ message: "No changes detected" });
        }

        // 3. Add ID to the end of values array
        values.push(id);
        const query = `
            UPDATE users 
            SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $${index}
        `;

        await pool.query(query, values);

        return NextResponse.json({ message: "User updated successfully" });

    } catch (error: any) {
        // 4. Specific handle for Duplicate Email (Postgres error code 23505)
        if (error.code === '23505') {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }
        console.error(error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}