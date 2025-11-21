import { NextResponse } from 'next/server';

const databaseId = process.env.NOTION_DATABASE_ID;

export async function GET() {
    try {
        // Fetch database schema to get select options
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const database = await response.json();

        // Extract Level and Type options
        const levelOptions = database.properties?.['Level']?.select?.options?.map((opt: any) => opt.name) || [];
        const typeOptions = database.properties?.['Type']?.select?.options?.map((opt: any) => opt.name) || [];

        return NextResponse.json({
            levels: levelOptions,
            types: typeOptions,
        });
    } catch (error) {
        console.error('Error fetching options:', error);
        return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
    }
}
