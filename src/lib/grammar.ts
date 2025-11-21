import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const grammarDatabaseId = process.env.NOTION_GRAMMAR_DATABASE_ID || '';

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
    const databaseId = process.env.NOTION_GRAMMAR_DATABASE_ID;
    if (!databaseId) {
        console.error('[grammar.ts] NOTION_GRAMMAR_DATABASE_ID is not set');
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
                category: props.Category?.select?.name || '',
                order: props.Order?.number || 0,
                explanation: props.Explanation?.rich_text?.[0]?.plain_text || '',
                structure: props.Structure?.rich_text?.[0]?.plain_text || '',
                examples: props.Examples?.rich_text?.[0]?.plain_text || '',
                notes: props.Notes?.rich_text?.[0]?.plain_text || '',
                dateAdded: new Date(page.created_time).getTime(),
            };
        });
    } catch (error) {
        console.error('[grammar.ts] Error fetching grammar:', error);
        throw error;
    }
}

export async function addGrammar(grammar: Omit<GrammarItem, 'id' | 'dateAdded'>): Promise<void> {
    const databaseId = process.env.NOTION_GRAMMAR_DATABASE_ID;
    if (!databaseId) {
        throw new Error('NOTION_GRAMMAR_DATABASE_ID is not set');
    }

    try {
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Title: {
                    title: [{ text: { content: grammar.title } }],
                },
                Level: {
                    select: { name: grammar.level },
                },
                Category: {
                    select: { name: grammar.category },
                },
                Order: {
                    number: grammar.order,
                },
                Explanation: {
                    rich_text: [{ text: { content: grammar.explanation } }],
                },
                ...(grammar.structure && {
                    Structure: {
                        rich_text: [{ text: { content: grammar.structure } }],
                    },
                }),
                Examples: {
                    rich_text: [{ text: { content: grammar.examples } }],
                },
                ...(grammar.notes && {
                    Notes: {
                        rich_text: [{ text: { content: grammar.notes } }],
                    },
                }),
            },
        });
    } catch (error) {
        console.error('[grammar.ts] Error adding grammar:', error);
        throw error;
    }
}
