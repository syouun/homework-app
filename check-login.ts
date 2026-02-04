import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking database connection...");
    try {
        const user = await prisma.user.findUnique({
            where: { username: 'parent' }
        });

        if (!user) {
            console.log("❌ User 'parent' NOT FOUND in database.");
            console.log("Suggestion: Run 'npx prisma db seed' to create initial users.");
        } else {
            console.log("✅ User 'parent' found.");
            console.log("Stored Hash:", user.password);

            const isValid = await bcrypt.compare('password123', user.password);
            if (isValid) {
                console.log("✅ Password 'password123' is VALID for this hash.");
            } else {
                console.log("❌ Password 'password123' is INVALID for this hash.");
                console.log("Suggestion: Run 'npx prisma db seed' again to reset passwords.");
            }
        }
    } catch (e) {
        console.error("❌ Database Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
