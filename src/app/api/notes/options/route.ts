import { NextResponse } from 'next/server';

const notesDatabaseId = process.env.NOTION_NOTES_DATABASE_ID || '';

export async function GET() {
    try {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${notesDatabaseId}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Notion API error: ${response.status}`);
        }

        const database = await response.json();
        const properties = database.properties;

        // Extract select options for Category and Tags
        const categories = properties.Category?.select?.options?.map((opt: any) => opt.name) || [];
        const tags = properties.Tags?.multi_select?.options?.map((opt: any) => opt.name) || [];

        return NextResponse.json({ categories, tags });
    } catch (error: any) {
        console.error('GET /api/notes/options Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch notes options',
            message: error.message,
        }, { status: 500 });
    }
}
