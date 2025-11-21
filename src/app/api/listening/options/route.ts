import { NextResponse } from 'next/server';

const notion_token = process.env.NOTION_TOKEN;
const listeningDatabaseId = process.env.NOTION_LISTENING_DATABASE_ID;

export async function GET() {
    try {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${listeningDatabaseId}`,
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

        // Extract select options for Level and Topic
        const levels = properties.Level?.select?.options?.map((opt: any) => opt.name) || [];
        const topics = properties.Topic?.select?.options?.map((opt: any) => opt.name) || [];

        return NextResponse.json({ levels, topics });
    } catch (error: any) {
        console.error('GET /api/listening/options Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch listening options',
            message: error.message,
        }, { status: 500 });
    }
}
