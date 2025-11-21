import { NextResponse } from 'next/server';

const notion_token = process.env.NOTION_TOKEN;
const grammarDatabaseId = process.env.NOTION_GRAMMAR_DATABASE_ID;

export async function GET() {
    try {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${grammarDatabaseId}`,
            {
                headers: {
                    'Authorization': `Bearer ${notion_token}`,
                    'Notion-Version': '2022-06-28',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Notion API error: ${response.status}`);
        }

        const database = await response.json();
        const properties = database.properties;

        // Extract select options for Level and Category
        const levels = properties.Level?.select?.options?.map((opt: any) => opt.name) || [];
        const categories = properties.Category?.select?.options?.map((opt: any) => opt.name) || [];

        return NextResponse.json({ levels, categories });
    } catch (error: any) {
        console.error('GET /api/grammar/options Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch grammar options',
            message: error.message,
        }, { status: 500 });
    }
}
