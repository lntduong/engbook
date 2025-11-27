// scripts/migrate-from-notion.ts
import { PrismaClient } from '@prisma/client';
import { getVocab } from '../src/lib/vocabulary';
import { getGrammar } from '../src/lib/grammar';
import { getListeningEpisodes } from '../src/lib/listening';
import { getNotes } from '../src/lib/notes';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function migrate() {
    console.log('🚀 Starting migration...');

    // 1. Vocabulary
    console.log('📦 Fetching Vocabulary from Notion...');
    try {
        const vocabItems = await getVocab();
        console.log(`Found ${vocabItems.length} items. Inserting into Postgres...`);

        for (const item of vocabItems) {
            await prisma.vocabulary.create({
                data: {
                    word: item.word,
                    ipa: item.ipa,
                    meaning: item.meaning,
                    level: item.level,
                    type: item.type || 'noun',
                    lesson: item.lesson,
                    example: item.example,
                    dateAdded: new Date(item.dateAdded),
                },
            });
        }
    } catch (error) {
        console.error('Error migrating Vocabulary:', error);
    }

    // 2. Grammar
    console.log('📦 Fetching Grammar...');
    try {
        const grammarItems = await getGrammar();
        console.log(`Found ${grammarItems.length} items.`);

        for (const item of grammarItems) {
            await prisma.grammar.create({
                data: {
                    title: item.title,
                    level: item.level,
                    category: item.category,
                    order: item.order,
                    explanation: item.explanation,
                    structure: item.structure,
                    examples: item.examples,
                    notes: item.notes,
                    dateAdded: new Date(item.dateAdded),
                },
            });
        }
    } catch (error) {
        console.error('Error migrating Grammar:', error);
    }

    // 3. Listening
    console.log('📦 Fetching Listening...');
    try {
        const listeningItems = await getListeningEpisodes();
        console.log(`Found ${listeningItems.length} items.`);

        for (const item of listeningItems) {
            await prisma.listening.create({
                data: {
                    title: item.title,
                    level: item.level,
                    topic: item.topic,
                    order: item.order,
                    audioUrl: item.audioUrl,
                    duration: item.duration,
                    transcript: item.transcript,
                    notes: item.notes,
                    myWriting: item.myWriting,
                    dateAdded: new Date(item.dateAdded),
                },
            });
        }
    } catch (error) {
        console.error('Error migrating Listening:', error);
    }

    // 4. Notes
    console.log('📦 Fetching Notes...');
    try {
        const notesItems = await getNotes();
        console.log(`Found ${notesItems.length} items.`);

        for (const item of notesItems) {
            await prisma.note.create({
                data: {
                    title: item.title,
                    content: item.content,
                    category: item.category,
                    tags: item.tags || [],
                    order: item.order || 0,
                    dateCreated: new Date(item.dateCreated),
                    lastEdited: new Date(item.lastEdited),
                },
            });
        }
    } catch (error) {
        console.error('Error migrating Notes:', error);
    }

    console.log('✅ Migration complete!');
}

migrate()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
