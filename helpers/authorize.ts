import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface JwtPayload {
    id: string;
    role: "super_admin" | "artist_manager" | "artist";
}

export function authorize(
    req: NextRequest,
    allowedRoles: JwtPayload["role"][]
): { authorized: boolean; user?: JwtPayload } {

    const token = req.cookies.get("token")?.value;

    if (!token) {
        return { authorized: false };
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        if (!allowedRoles.includes(decoded.role)) {
            return { authorized: false };
        }

        return { authorized: true, user: decoded };

    } catch (error) {
        return { authorized: false, };
    }
}