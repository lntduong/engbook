import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const listeningDatabaseId = process.env.NOTION_LISTENING_DATABASE_ID || '';

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
    const databaseId = process.env.NOTION_LISTENING_DATABASE_ID;
    if (!databaseId) {
        console.error('[listening.ts] NOTION_LISTENING_DATABASE_ID is not set');
        return [];
    }

    try {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${databaseId}/query`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sorts: [
                        { property: 'Order', direction: 'ascending' }
                    ]
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Notion API error: ${response.status}`);
        }

        const data = await response.json();

        return data.results.map((page: any) => {
            const props = page.properties;

            return {
                id: page.id,
                title: props.Title?.title?.[0]?.plain_text || '',
                level: props.Level?.select?.name || '',
                topic: props.Topic?.select?.name || '',
                order: props.Order?.number || 0,
                audioUrl: props['Audio URL']?.url || '',
                duration: props.Duration?.rich_text?.[0]?.plain_text || '0:00',
                transcript: props.Transcript?.rich_text?.[0]?.plain_text || '',
                notes: props.Notes?.rich_text?.[0]?.plain_text || '',
                myWriting: props['My Writing']?.rich_text?.[0]?.plain_text || '',
                dateAdded: new Date(page.created_time).getTime(),
            };
        });
    } catch (error) {
        console.error('[listening.ts] Error fetching listening episodes:', error);
        throw error;
    }
}

export async function addListeningEpisode(episode: Omit<ListeningEpisode, 'id' | 'dateAdded' | 'myWriting'>) {
    const databaseId = process.env.NOTION_LISTENING_DATABASE_ID;
    if (!databaseId) {
        throw new Error('NOTION_LISTENING_DATABASE_ID is not set');
    }

    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Title: {
                    title: [{ text: { content: episode.title } }],
                },
                Level: {
                    select: { name: episode.level },
                },
                Topic: {
                    select: { name: episode.topic },
                },
                Order: {
                    number: episode.order,
                },
                'Audio URL': {
                    url: episode.audioUrl,
                },
                Duration: {
                    rich_text: [{ text: { content: episode.duration } }],
                },
                Transcript: {
                    rich_text: [{ text: { content: episode.transcript } }],
                },
                ...(episode.notes && {
                    Notes: {
                        rich_text: [{ text: { content: episode.notes } }],
                    },
                }),
            },
        });

        return response;
    } catch (error) {
        console.error('[listening.ts] Error adding listening episode:', error);
        throw error;
    }
}

export async function updateListeningEpisode(episodeId: string, myWriting: string) {
    try {
        const response = await notion.pages.update({
            page_id: episodeId,
            properties: {
                'My Writing': {
                    rich_text: [{ text: { content: myWriting } }],
                },
            },
        });

        return response;
    } catch (error) {
        console.error('[listening.ts] Error updating listening episode:', error);
        throw error;
    }
}
