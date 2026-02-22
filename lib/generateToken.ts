import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(payload: any) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d",
    });
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}