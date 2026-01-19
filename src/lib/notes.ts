import { prisma } from './prisma';

export interface Note {
    id: string;
    title: string;
    content: string;
    category?: string;
    tags?: string[];
    order?: number;
    dateCreated: number;
    lastEdited: number;
}

export async function getNotes(): Promise<Note[]> {
    try {
        const items = await prisma.note.findMany({
            orderBy: { order: 'asc' },
        });

        return items.map(item => ({
            id: item.id,
            title: item.title,
            content: item.content,
            category: item.category || undefined,
            tags: item.tags,
            order: item.order,
            dateCreated: item.dateCreated.getTime(),
            lastEdited: item.lastEdited.getTime(),
        }));
    } catch (error) {
        console.error('[notes.ts] Error fetching notes from Prisma:', error);
        return [];
    }
}

export async function getNoteById(noteId: string): Promise<Note | null> {
    try {
        const item = await prisma.note.findUnique({
            where: { id: noteId },
        });

        if (!item) return null;

        return {
            id: item.id,
            title: item.title,
            content: item.content,
            category: item.category || undefined,
            tags: item.tags,
            order: item.order,
            dateCreated: item.dateCreated.getTime(),
            lastEdited: item.lastEdited.getTime(),
        };
    } catch (error) {
        console.error('[notes.ts] Error fetching note by ID from Prisma:', error);
        return null;
    }
}

export async function addNote(note: Omit<Note, 'id' | 'dateCreated' | 'lastEdited'>): Promise<void> {
    try {
        await prisma.note.create({
            data: {
                title: note.title,
                content: note.content,
                category: note.category,
                tags: note.tags || [],
                order: note.order || 0,
            },
        });
    } catch (error) {
        console.error('[notes.ts] Error adding note to Prisma:', error);
        throw error;
    }
}

export async function updateNote(
    noteId: string,
    updates: Partial<Omit<Note, 'id' | 'dateCreated' | 'lastEdited'>>
): Promise<void> {
    try {
        await prisma.note.update({
            where: { id: noteId },
            data: {
                title: updates.title,
                content: updates.content,
                category: updates.category,
                tags: updates.tags,
                order: updates.order,
            },
        });
    } catch (error) {
        console.error('[notes.ts] Error updating note in Prisma:', error);
        throw error;
    }
}

export async function deleteNote(noteId: string): Promise<void> {
    try {
        await prisma.note.delete({
            where: { id: noteId },
        });
    } catch (error) {
        console.error('[notes.ts] Error deleting note from Prisma:', error);
        throw error;
    }
}

export async function getRelatedNotes(noteId: string, tags: string[], limit: number = 3): Promise<Note[]> {
    if (!tags || tags.length === 0) return [];

    try {
        const items = await prisma.note.findMany({
            where: {
                id: { not: noteId },
                tags: { hasSome: tags },
            },
            take: limit,
            orderBy: { dateCreated: 'desc' },
        });

        return items.map(item => ({
            id: item.id,
            title: item.title,
            content: item.content,
            category: item.category || undefined,
            tags: item.tags,
            order: item.order,
            dateCreated: item.dateCreated.getTime(),
            lastEdited: item.lastEdited.getTime(),
        })).sort((a, b) => {
            const aMatches = (a.tags || []).filter(t => tags.includes(t)).length;
            const bMatches = (b.tags || []).filter(t => tags.includes(t)).length;
            return bMatches - aMatches;
        });
    } catch (error) {
        console.error('[notes.ts] Error fetching related notes:', error);
        return [];
    }
}
