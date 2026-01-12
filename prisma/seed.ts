import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    const parentPassword = await bcrypt.hash('password123', 10);
    const childPassword = await bcrypt.hash('shoma123', 10);

    const parent = await prisma.user.upsert({
        where: { username: 'parent' },
        update: {
            password: parentPassword, // Force update password
        },
        create: {
            username: 'parent',
            password: parentPassword,
            name: 'お父さん', // Father
            role: Role.PARENT,
        },
    });

    const child = await prisma.user.upsert({
        where: { username: 'shoma' },
        update: {},
        create: {
            username: 'shoma',
            password: childPassword,
            name: 'しょうまくん', // Shoma-kun
            role: Role.CHILD,
        },
    });

    console.log({ parent, child });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
