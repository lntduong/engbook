import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const notesDatabaseId = process.env.NOTION_NOTES_DATABASE_ID || '';

export interface Note {
    id: string;
    title: string;
    content: string;
    category?: string;
    tags?: string[];
    dateCreated: number;
    lastEdited: number;
    order?: number;
}

export async function getNotes(): Promise<Note[]> {
    const databaseId = process.env.NOTION_NOTES_DATABASE_ID;
    if (!databaseId) {
        console.error('[notes.ts] NOTION_NOTES_DATABASE_ID is not set');
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
            throw new Error(`Notion API error: ${response.status}`);
        }

        const data = await response.json();

        return data.results.map((page: any) => {
            const props = page.properties;
            return {
                id: page.id,
                title: props.Title?.title?.[0]?.plain_text || '',
                content: props.Content?.rich_text?.[0]?.plain_text || '',
                category: props.Category?.select?.name || '',
                tags: props.Tags?.multi_select?.map((tag: any) => tag.name) || [],
                order: props.Order?.number || 0,
                dateCreated: new Date(page.created_time).getTime(),
                lastEdited: new Date(page.last_edited_time).getTime(),
            };
        });
    } catch (error) {
        console.error('[notes.ts] Error fetching notes from Notion:', error);
        return [];
    }
}

export async function getNoteById(noteId: string): Promise<Note | null> {
    try {
        const response = await fetch(
            `https://api.notion.com/v1/pages/${noteId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Notion API error: ${response.status}`);
        }

        const page = await response.json();
        const props = page.properties;

        return {
            id: page.id,
            title: props.Title?.title?.[0]?.plain_text || '',
            content: props.Content?.rich_text?.[0]?.plain_text || '',
            category: props.Category?.select?.name || '',
            tags: props.Tags?.multi_select?.map((tag: any) => tag.name) || [],
            order: props.Order?.number || 0,
            dateCreated: new Date(page.created_time).getTime(),
            lastEdited: new Date(page.last_edited_time).getTime(),
        };
    } catch (error) {
        console.error('[notes.ts] Error fetching note by ID:', error);
        return null;
    }
}

export async function addNote(note: Omit<Note, 'id' | 'dateCreated' | 'lastEdited'>): Promise<void> {
    const databaseId = process.env.NOTION_NOTES_DATABASE_ID;
    if (!databaseId) {
        throw new Error('NOTION_NOTES_DATABASE_ID is not set');
    }

    try {
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Title: {
                    title: [{ text: { content: note.title } }],
                },
                Content: {
                    rich_text: [{ text: { content: note.content } }],
                },
                ...(note.category && {
                    Category: {
                        select: { name: note.category },
                    },
                }),
                ...(note.tags && note.tags.length > 0 && {
                    Tags: {
                        multi_select: note.tags.map(tag => ({ name: tag })),
                    },
                }),
                ...(note.order !== undefined && {
                    Order: {
                        number: note.order,
                    },
                }),
            },
        });
    } catch (error) {
        console.error('[notes.ts] Error adding note:', error);
        throw error;
    }
}

export async function updateNote(
    noteId: string,
    updates: Partial<Omit<Note, 'id' | 'dateCreated' | 'lastEdited'>>
): Promise<void> {
    try {
        const properties: any = {};

        if (updates.title !== undefined) {
            properties.Title = {
                title: [{ text: { content: updates.title } }],
            };
        }

        if (updates.content !== undefined) {
            properties.Content = {
                rich_text: [{ text: { content: updates.content } }],
            };
        }

        if (updates.category !== undefined) {
            properties.Category = {
                select: { name: updates.category },
            };
        }

        if (updates.tags !== undefined) {
            properties.Tags = {
                multi_select: updates.tags.map(tag => ({ name: tag })),
            };
        }

        if (updates.order !== undefined) {
            properties.Order = {
                number: updates.order,
            };
        }

        await notion.pages.update({
            page_id: noteId,
            properties: properties,
        });
    } catch (error) {
        console.error('[notes.ts] Error updating note:', error);
        throw error;
    }
}

export async function deleteNote(noteId: string): Promise<void> {
    try {
        await notion.pages.update({
            page_id: noteId,
            archived: true,
        });
    } catch (error) {
        console.error('[notes.ts] Error deleting note:', error);
        throw error;
    }
}
