const { Client } = require('@notionhq/client');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function testAddWithLessonExample() {
    try {
        console.log('Testing add word with Lesson and Example...');
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                'Word': {
                    title: [{ text: { content: 'Wonderful' } }]
                },
                'IPA': {
                    rich_text: [{ text: { content: '/ˈwʌn.dɚ.fəl/' } }]
                },
                'Meaning': {
                    rich_text: [{ text: { content: 'Tuyệt vời' } }]
                },
                'Level': {
                    select: { name: 'A2' }
                },
                'Type': {
                    select: { name: 'adjective' }
                },
                'Lesson': {
                    rich_text: [{ text: { content: 'Unit 5' } }]
                },
                'Example': {
                    rich_text: [{ text: { content: 'What a wonderful day!' } }]
                }
            }
        });
        console.log('✓ SUCCESS! Added word with lesson and example');
        console.log('Word ID:', response.id);

        // Fetch back to verify
        console.log('\nFetching to verify...');
        const fetchResp = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });
        const data = await fetchResp.json();
        const wonderful = data.results.find(p => {
            const word = p.properties['Word']?.title?.[0]?.plain_text;
            return word === 'Wonderful';
        });

        if (wonderful) {
            const props = wonderful.properties;
            console.log('Found word "Wonderful":');
            console.log('  Lesson:', props.Lesson?.rich_text?.[0]?.plain_text || 'N/A');
            console.log('  Example:', props.Example?.rich_text?.[0]?.plain_text || 'N/A');
        }
    } catch (error) {
        console.error('✗ ERROR:', error.message);
        if (error.body) console.error('Details:', error.body);
    }
}

testAddWithLessonExample();
