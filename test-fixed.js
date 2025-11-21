const { Client } = require('@notionhq/client');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function testFixed() {
    try {
        console.log('Testing with correct property names...');
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                ' Word ': {  // Space trước và sau
                    title: [{ text: { content: 'Hello' } }]
                },
                'IPA': {  // Không có space
                    rich_text: [{ text: { content: '/həˈloʊ/' } }]
                },
                'Meaning': {  // Không có space
                    rich_text: [{ text: { content: 'Xin chào' } }]
                },
                'Level ': {  // Space sau
                    select: { name: 'A1' }
                },
                'Type ': {  // Space sau
                    select: { name: 'noun' }
                }
            }
        });
        console.log('✓ SUCCESS! Added word:', response.id);

        // Fetch to confirm
        const list = await notion.databases.query({ database_id: databaseId });
        console.log('Total words now:', list.results.length);
        list.results.forEach((page, i) => {
            const word = page.properties[' Word ']?.title?.[0]?.plain_text;
            console.log(`  ${i + 1}. ${word}`);
        });
    } catch (error) {
        console.error('✗ ERROR:', error.message);
    }
}

testFixed();
