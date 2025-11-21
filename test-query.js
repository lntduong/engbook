const { Client } = require('@notionhq/client');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function testQuery() {
    console.log('Testing databases.query...');
    console.log('Database ID:', databaseId);

    try {
        console.log('\n--- Querying database ---');
        const result = await notion.databases.query({ database_id: databaseId });
        console.log('✓ Query worked! Results:', result.results.length);

        if (result.results.length > 0) {
            const page = result.results[0];
            console.log('\nFirst result:');
            console.log('ID:', page.id);
            console.log('Property keys:', Object.keys(page.properties));

            // Try to extract Word
            const wordProp = page.properties[' Word '];
            if (wordProp) {
                const word = wordProp.title && wordProp.title[0] ? wordProp.title[0].plain_text : 'N/A';
                console.log('Word value:', word);
            } else {
                console.log('✗ " Word " property not found!');
                console.log('Available properties:', Object.keys(page.properties));
            }
        } else {
            console.log('✗ No results returned from query!');
        }
    } catch (error) {
        console.error('✗ Query failed:', error.message);
    }
}

testQuery();
