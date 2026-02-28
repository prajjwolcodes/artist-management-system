import { pool } from "@/lib/db";
import { generateToken } from "@/lib/generateToken";
import { sendActivationEmail } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const client = await pool.connect();

    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        await client.query("BEGIN");

        // Find user by email and role
        const userResult = await client.query(
            `
      SELECT id, email, first_name, is_active
      FROM users
      WHERE email = $1
      AND role = 'artist'
      `,
            [email]
        );

        if (userResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return NextResponse.json(
                { error: "Artist not found" },
                { status: 404 }
            );
        }

        const user = userResult.rows[0];

        if (user.is_active) {
            await client.query("ROLLBACK");
            return NextResponse.json(
                { error: "Account is already activated" },
                { status: 400 }
            );
        }

        // Generate new activation token
        const activationToken = generateToken({ id: user.id, role: user.role }); // Token valid for 1 day
        const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Update user with new token
        await client.query(
            `
      UPDATE users
      SET
        activation_token = $1,
        activation_expires = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      `,
            [activationToken, activationExpires, user.id]
        );

        await client.query("COMMIT");

        // Send activation email
        const activationUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/activate/artist?token=${activationToken}`;
        await sendActivationEmail(email, activationUrl);

        return NextResponse.json({
            message: "Activation link sent successfully",
        });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return NextResponse.json(
            { error: "Failed to resend activation link" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
