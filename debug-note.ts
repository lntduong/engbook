
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const id = '001f3b3e-9ae8-4a45-aaaa-976e2979f83b';
    console.log(`Fetching note with ID: ${id}`);
    try {
        const note = await prisma.note.findUnique({
            where: { id },
        });
        console.log('Note found:', note ? 'Yes' : 'No');
        if (note) {
            console.log('Content length:', note.content.length);
            console.log('Content preview:', note.content.substring(0, 100));
        }
    } catch (error) {
        console.error('Error fetching note:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
