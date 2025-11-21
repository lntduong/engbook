const { Client } = require('@notionhq/client');
const fs = require('fs');

// Read env
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function testAddWord() {
    try {
        console.log('Adding word to database:', databaseId);
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Word: {
                    title: [{ text: { content: 'Hello' } }]
                },
                IPA: {
                    rich_text: [{ text: { content: '/həˈloʊ/' } }]
                },
                Meaning: {
                    rich_text: [{ text: { content: 'Xin chào' } }]
                },
                Level: {
                    select: { name: 'A1' }
                },
                Type: {
                    select: { name: 'noun' }
                }
            }
        });
        console.log('✓ SUCCESS! Added word with ID:', response.id);
        console.log('Now fetching all words...');

        const list = await notion.databases.query({ database_id: databaseId });
        console.log('Total words in database:', list.results.length);
        list.results.forEach(page => {
            const word = page.properties.Word?.title?.[0]?.plain_text;
            console.log('  -', word);
        });
    } catch (error) {
        console.error('✗ ERROR:', error.message);
        if (error.body) console.error('Details:', error.body);
    }
}

testAddWord();
