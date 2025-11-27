import { prisma } from './prisma';

export interface ListeningEpisode {
    id: string;
    title: string;
    level: string;
    topic: string;
    order: number;
    audioUrl: string;
    duration: string;
    transcript: string;
    notes?: string;
    myWriting?: string;
    dateAdded: number;
}

export async function getListeningEpisodes(): Promise<ListeningEpisode[]> {
    try {
        const items = await prisma.listening.findMany({
            orderBy: { order: 'asc' },
        });

        return items.map(item => ({
            id: item.id,
            title: item.title,
            level: item.level,
            topic: item.topic,
            order: item.order,
            audioUrl: item.audioUrl,
            duration: item.duration,
            transcript: item.transcript,
            notes: item.notes || undefined,
            myWriting: item.myWriting || undefined,
            dateAdded: item.dateAdded.getTime(),
        }));
    } catch (error) {
        console.error('[listening.ts] Error fetching listening episodes from Prisma:', error);
        return [];
    }
}

export async function addListeningEpisode(episode: Omit<ListeningEpisode, 'id' | 'dateAdded' | 'myWriting'>) {
    try {
        const newItem = await prisma.listening.create({
            data: {
                title: episode.title,
                level: episode.level,
                topic: episode.topic,
                order: episode.order,
                audioUrl: episode.audioUrl,
                duration: episode.duration,
                transcript: episode.transcript,
                notes: episode.notes,
            },
        });
        return newItem;
    } catch (error) {
        console.error('[listening.ts] Error adding listening episode to Prisma:', error);
        throw error;
    }
}

export async function updateListeningEpisode(episodeId: string, myWriting: string) {
    try {
        const updatedItem = await prisma.listening.update({
            where: { id: episodeId },
            data: {
                myWriting: myWriting,
            },
        });
        return updatedItem;
    } catch (error) {
        console.error('[listening.ts] Error updating listening episode in Prisma:', error);
        throw error;
    }
}

export async function deleteListeningEpisode(id: string): Promise<void> {
    try {
        await prisma.listening.delete({
            where: { id },
        });
    } catch (error) {
        console.error('[listening.ts] Error deleting listening episode from Prisma:', error);
        throw error;
    }
}
