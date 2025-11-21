const { Client } = require('@notionhq/client');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function testAddSimple() {
    try {
        console.log('Attempting to add word to:', databaseId);

        // Test với data đơn giản nhất
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Word: {
                    title: [{ text: { content: 'Test' } }]
                }
            }
        });

        console.log('✓ SUCCESS! Word added with ID:', response.id);

        // Fetch lại để xem
        const list = await notion.databases.query({ database_id: databaseId });
        console.log('Total words:', list.results.length);

    } catch (error) {
        console.error('✗ ERROR:', error.message);
        console.error('Code:', error.code);
    }
}

testAddSimple();
