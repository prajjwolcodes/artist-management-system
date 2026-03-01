import { authorize } from "@/helpers/authorize";
import { pool } from "@/lib/db";
import { sendActivationEmail } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { authorized } = authorize(req, ["super_admin"]);

        if (!authorized) {
            return NextResponse.json(
                { error: "Forbidden to perform this action" },
                { status: 403 }
            );
        }

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const userResult = await pool.query(
            `
      SELECT id, email, is_active
      FROM users
      WHERE email = $1
      AND role = 'artist_manager'
      `,
            [email]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json({ error: "Manager not found" }, { status: 404 });
        }

        const user = userResult.rows[0];

        if (user.is_active) {
            return NextResponse.json(
                { error: "Account is already activated" },
                { status: 400 }
            );
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await pool.query(
            `
      UPDATE users
      SET activation_token = $1,
          activation_expires = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      `,
            [token, expires, user.id]
        );

        const activationLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/activate/manager?token=${token}`;
        await sendActivationEmail(email, activationLink);

        return NextResponse.json({ message: "Activation link sent successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to resend activation link" },
            { status: 500 }
        );
    }
}