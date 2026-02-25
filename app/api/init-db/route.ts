import { authorize } from "@/helpers/authorize";
import { initDB } from "@/lib/initializeDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // const { authorized } = authorize(req, ["super_admin"]);
        // if (!authorized) {
        //     return NextResponse.json({ error: "Forbidden to perform this action" }, { status: 403 });
        // }
        await initDB();
        return NextResponse.json({ message: "Database initialized successfully" });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}