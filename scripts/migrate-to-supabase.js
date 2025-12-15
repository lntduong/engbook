const { PrismaClient } = require('@prisma/client');

async function migrate() {
    console.log('🚀 Starting migration check...');

    if (!process.env.DATABASE_URL_OLD) {
        console.error('❌ Error: DATABASE_URL_OLD is missing in .env');
        console.error('   Please rename your current DATABASE_URL_DATA to DATABASE_URL_OLD');
        console.error('   And add the new Supabase URL as DATABASE_URL_DATA');
        process.exit(1);
    }

    if (!process.env.DATABASE_URL_DATA) {
        console.error('❌ Error: DATABASE_URL_DATA is missing in .env');
        process.exit(1);
    }

    console.log('🔌 Connecting to OLD database...');
    const oldPrisma = new PrismaClient({
        datasources: { db: { url: process.env.DATABASE_URL_OLD } },
    });

    console.log('🔌 Connecting to NEW (Supabase) database...');
    const newPrisma = new PrismaClient({
        datasources: { db: { url: process.env.DATABASE_URL_DATA } },
    });

    try {
        // 1. Migrate Schema first (ensure tables exist)
        // Note: We assume 'npx prisma db push' has been run or will be run. 
        // Usually better to run this script AFTER schema push.

        // 2. Transfer Vocabulary
        console.log('Reading Vocabularies...');
        const vocabularies = await oldPrisma.vocabulary.findMany();
        console.log(`Found ${vocabularies.length} vocabularies. Transferring...`);
        if (vocabularies.length > 0) {
            await newPrisma.vocabulary.createMany({
                data: vocabularies,
                skipDuplicates: true,
            });
        }

        // 3. Transfer Grammar
        console.log('Reading Grammar...');
        const grammars = await oldPrisma.grammar.findMany();
        console.log(`Found ${grammars.length} grammars. Transferring...`);
        if (grammars.length > 0) {
            await newPrisma.grammar.createMany({
                data: grammars,
                skipDuplicates: true,
            });
        }

        // 4. Transfer Listening
        console.log('Reading Listening...');
        const listenings = await oldPrisma.listening.findMany();
        console.log(`Found ${listenings.length} listenings. Transferring...`);
        if (listenings.length > 0) {
            await newPrisma.listening.createMany({
                data: listenings,
                skipDuplicates: true,
            });
        }

        // 5. Transfer Notes
        console.log('Reading Notes...');
        const notes = await oldPrisma.note.findMany();
        console.log(`Found ${notes.length} notes. Transferring...`);
        if (notes.length > 0) {
            await newPrisma.note.createMany({
                data: notes,
                skipDuplicates: true,
            });
        }

        console.log('✅ Migration completed successfully!');

    } catch (e) {
        console.error('❌ Migration failed:', e);
    } finally {
        await oldPrisma.$disconnect();
        await newPrisma.$disconnect();
    }
}

migrate();
