import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

console.log('Resetting passwords With IPv4 fix...');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL?.replace('localhost', '127.0.0.1'),
        },
    },
});

async function main() {
    console.log('Resetting passwords...');
    console.log('DB URL:', process.env.DATABASE_URL ? 'FOUND' : 'MISSING');
    if (process.env.DATABASE_URL) console.log('DB Host:', process.env.DATABASE_URL.split('@')[1]);

    const parentPass = await bcrypt.hash('password123', 10);
    const childPass = await bcrypt.hash('shoma123', 10);

    await prisma.user.update({
        where: { username: 'parent' },
        data: { password: parentPass },
    });
    console.log('Parent password reset.');

    await prisma.user.update({
        where: { username: 'shoma' },
        data: { password: childPass },
    });
    console.log('Child password reset.');
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
