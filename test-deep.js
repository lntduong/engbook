const { Client } = require('@notionhq/client');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function testLessonExample() {
    try {
        console.log('\n=== Testing Lesson and Example Save ===\n');

        // Test 1: Add with all fields
        console.log('Test 1: Adding "Fantastic" with lesson and example...');
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                'Word': { title: [{ text: { content: 'Fantastic' } }] },
                'IPA': { rich_text: [{ text: { content: '/fænˈtæs.tɪk/' } }] },
                'Meaning': { rich_text: [{ text: { content: 'Tuyệt vời, kỳ diệu' } }] },
                'Level': { select: { name: 'B2' } },
                'Type': { select: { name: 'adjective' } },
                'Lesson': { rich_text: [{ text: { content: 'Unit 8' } }] },
                'Example': { rich_text: [{ text: { content: 'The movie was absolutely fantastic!' } }] }
            }
        });
        console.log('✓ Added! Page ID:', response.id);

        // Test 2: Fetch back
        console.log('\nTest 2: Fetching back to verify...');
        const fetchResp = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Word',
                    title: { equals: 'Fantastic' }
                }
            })
        });

        const data = await fetchResp.json();
        if (data.results && data.results.length > 0) {
            const page = data.results[0];
            const props = page.properties;
            console.log('✓ Found "Fantastic":');
            console.log('  Word:', props['Word']?.title?.[0]?.plain_text);
            console.log('  Lesson:', props.Lesson?.rich_text?.[0]?.plain_text || '[EMPTY]');
            console.log('  Example:', props.Example?.rich_text?.[0]?.plain_text || '[EMPTY]');
            console.log('\n  Full Lesson property:', JSON.stringify(props.Lesson, null, 2));
            console.log('\n  Full Example property:', JSON.stringify(props.Example, null, 2));
        } else {
            console.log('✗ Word not found!');
        }
    } catch (error) {
        console.error('✗ ERROR:', error.message);
        if (error.body) console.error('Error body:', error.body);
    }
}

testLessonExample();
