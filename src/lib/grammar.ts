import { prisma } from './prisma';

export interface GrammarItem {
    id: string;
    title: string;
    level: string;
    category: string;
    order: number;
    explanation: string;
    structure?: string;
    examples: string;
    notes?: string;
    dateAdded: number;
}

export async function getGrammar(): Promise<GrammarItem[]> {
    try {
        const items = await prisma.grammar.findMany({
            orderBy: { order: 'asc' },
        });

        return items.map(item => ({
            id: item.id,
            title: item.title,
            level: item.level,
            category: item.category,
            order: item.order,
            explanation: item.explanation,
            structure: item.structure || undefined,
            examples: item.examples,
            notes: item.notes || undefined,
            dateAdded: item.dateAdded.getTime(),
        }));
    } catch (error) {
        console.error('[grammar.ts] Error fetching grammar from Prisma:', error);
        return [];
    }
}

export async function addGrammar(grammar: Omit<GrammarItem, 'id' | 'dateAdded'>): Promise<void> {
    try {
        await prisma.grammar.create({
            data: {
                title: grammar.title,
                level: grammar.level,
                category: grammar.category,
                order: grammar.order,
                explanation: grammar.explanation,
                structure: grammar.structure,
                examples: grammar.examples,
                notes: grammar.notes,
            },
        });
    } catch (error) {
        console.error('[grammar.ts] Error adding grammar to Prisma:', error);
        throw error;
    }
}

export async function deleteGrammarItem(id: string): Promise<void> {
    try {
        await prisma.grammar.delete({
            where: { id },
        });
    } catch (error) {
        console.error('[grammar.ts] Error deleting grammar from Prisma:', error);
        throw error;
    }
}
