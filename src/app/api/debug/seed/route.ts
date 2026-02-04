import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Seeding database via API...");

        const parentPassword = await bcrypt.hash("password123", 10);
        const childPassword = await bcrypt.hash("shoma123", 10);

        await prisma.user.upsert({
            where: { username: "parent" },
            update: {
                password: parentPassword,
            },
            create: {
                username: "parent",
                password: parentPassword,
                name: "お父さん",
                role: Role.PARENT,
            },
        });

        await prisma.user.upsert({
            where: { username: "shoma" },
            update: {},
            create: {
                username: "shoma",
                password: childPassword,
                name: "しょうまくん",
                role: Role.CHILD,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Database seeded successfully",
            users: ["parent", "shoma"],
        });
    } catch (error) {
        console.error("Seeding failed:", error);
        return NextResponse.json(
            { success: false, error: "Failed to seed database" },
            { status: 500 }
        );
    }
}
