import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/generateToken";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    const publicRoutes = ["/login", "/register"];

    // User not logged in
    if (!token) {
        if (!publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.next();
    }

    // User logged in
    try {
        verifyToken(token);

        if (publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("token");
        return response;
    }
}

export const config = {
    matcher: [
        "/admin",
        "/admin/:path*",
        "/login",
        "/register"]

}