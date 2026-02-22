import { initDB } from "@/lib/initializeDb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await initDB();
        return NextResponse.json({ message: "Database initialized successfully" });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}