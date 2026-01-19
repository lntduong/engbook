
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = process.env.DEFAULT_ADMIN_EMAIL;
    const password = process.env.DEFAULT_ADMIN_PASSWORD;

    if (!email || !password) {
        console.error('❌ Missing DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD environment variables.');
        process.exit(1);
    }

    console.log(`Checking for admin user: ${email}...`);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`✅ User ${email} already exists.`);
        if (existingUser.role !== 'SUPER_ADMIN') {
            console.log(`Updating role to SUPER_ADMIN...`);
            await prisma.user.update({
                where: { id: existingUser.id },
                data: { role: 'SUPER_ADMIN' },
            });
            console.log(`✅ Role updated.`);
        }
        return;
    }

    console.log(`Creating new SUPER_ADMIN user...`);
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await prisma.user.create({
        data: {
            email,
            passwordHash,
            role: 'SUPER_ADMIN',
            name: 'Super Admin',
        },
    });

    console.log(`✅ Super Admin created successfully.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
