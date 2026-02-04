import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Attempt to count users to verify DB connection
        const userCount = await prisma.user.count();
        const userSample = await prisma.user.findFirst({
            select: { username: true, role: true }
        });

        const dbUrl = process.env.DATABASE_URL || "NOT_SET";
        const maskedUrl = dbUrl.replace(/:([^@]+)@/, ":****@");

        return NextResponse.json({
            status: "OK",
            message: "Database connection successful",
            userCount,
            sampleUser: userSample,
            databaseUrl: maskedUrl,
            nodeEnv: process.env.NODE_ENV,
        });
    } catch (e: any) {
        return NextResponse.json({
            status: "ERROR",
            message: "Database connection failed",
            error: e.message,
            stack: e.stack,
            databaseUrl: process.env.DATABASE_URL ? "SET (Masked on error)" : "NOT_SET",
        }, { status: 500 });
    }
}
