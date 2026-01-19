import { prisma } from './prisma';

export interface VocabItem {
    id: string;
    word: string;
    ipa: string | null;
    meaning: string;
    level: string;
    type?: string;
    lesson?: string | null;
    example?: string | null;
    dateAdded: number;
}

export async function getVocab(): Promise<VocabItem[]> {
    try {
        const items = await prisma.vocabulary.findMany({
            orderBy: { dateAdded: 'desc' },
        });

        return items.map(item => ({
            id: item.id,
            word: item.word,
            ipa: item.ipa,
            meaning: item.meaning,
            level: item.level,
            type: item.type,
            lesson: item.lesson,
            example: item.example,
            dateAdded: item.dateAdded.getTime(),
        }));
    } catch (error) {
        console.error('[vocabulary.ts] Error fetching vocab from Prisma:', error);
        return [];
    }
}

export async function addVocabItem(item: Omit<VocabItem, 'id' | 'dateAdded'>): Promise<void> {
    try {
        await prisma.vocabulary.create({
            data: {
                word: item.word,
                ipa: item.ipa || '',
                meaning: item.meaning,
                level: item.level,
                type: item.type || 'noun',
                lesson: item.lesson || '',
                example: item.example || '',
            },
        });
    } catch (error) {
        console.error('[vocabulary.ts] Error adding vocab to Prisma:', error);
        throw error;
    }
}

export async function deleteVocabItem(id: string): Promise<void> {
    try {
        await prisma.vocabulary.delete({
            where: { id },
        });
    } catch (error) {
        console.error('[vocabulary.ts] Error deleting vocab from Prisma:', error);
        throw error;
    }
}
