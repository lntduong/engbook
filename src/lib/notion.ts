import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export const databaseId = process.env.NOTION_DATABASE_ID;

export interface VocabItem {
    id: string;
    word: string;
    ipa: string;
    meaning: string;
    level: string;
    type?: string;
    lesson?: string;
    example?: string;
    dateAdded: number;
}

export async function getVocab(): Promise<VocabItem[]> {
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
        console.error('[notion.ts] NOTION_DATABASE_ID is not set');
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
                body: JSON.stringify({}),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[notion.ts] Notion API error:', response.status, errorText);
            throw new Error(`Notion API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('[notion.ts] Query successful, results:', data.results?.length || 0);

        return data.results.map((page: any) => {
            const props = page.properties;
            return {
                id: page.id,
                word: props['Word']?.title?.[0]?.plain_text || '',
                ipa: props.IPA?.rich_text?.[0]?.plain_text || '',
                meaning: props.Meaning?.rich_text?.[0]?.plain_text || '',
                level: props['Level']?.select?.name || 'A1',
                type: props['Type']?.select?.name || 'noun',
                lesson: props.Lesson?.rich_text?.[0]?.plain_text || '',
                example: props.Example?.rich_text?.[0]?.plain_text || '',
                dateAdded: new Date(page.created_time).getTime(),
            };
        });
    } catch (error: any) {
        console.error('[notion.ts] Error fetching vocab from Notion:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error:', error);
        return [];
    }
}

export async function addVocabItem(item: VocabItem): Promise<void> {
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
        throw new Error('NOTION_DATABASE_ID is not set');
    }

    try {
        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parent: { database_id: databaseId },
                properties: {
                    'Word': {
                        title: [{ text: { content: item.word } }],
                    },
                    'IPA': {
                        rich_text: [{ text: { content: item.ipa } }],
                    },
                    'Meaning': {
                        rich_text: [{ text: { content: item.meaning } }],
                    },
                    'Level': {
                        select: { name: item.level },
                    },
                    'Type': {
                        select: { name: item.type || 'noun' },
                    },
                    'Lesson': {
                        rich_text: [{ text: { content: item.lesson || '' } }],
                    },
                    'Example': {
                        rich_text: [{ text: { content: item.example || '' } }],
                    },
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Notion API error:', errorData);
            throw new Error('Failed to add item to Notion');
        }

        const data = await response.json();
    } catch (error) {
        console.error('Error adding to Notion:', error);
        throw error;
    }
}
