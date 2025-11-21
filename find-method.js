const { Client } = require('@notionhq/client');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function findQueryMethod() {
    console.log('Inspecting notion.databases object...');
    console.log('Type:', typeof notion.databases);
    console.log('Methods:', Object.keys(notion.databases));
    console.log('\nTrying different approaches...\n');

    // Try method 1: Direct
    try {
        console.log('Try 1: notion.databases.query()');
        const r = await notion.databases.query({ database_id: databaseId });
        console.log('✓ Worked!', r.results.length, 'results');
    } catch (e) {
        console.log('✗ Failed:', e.message);
    }

    // Try method 2: pages.query
    try {
        console.log('\nTry 2: notion.pages.query()');
        const r = await notion.pages.query({ database_id: databaseId });
        console.log('✓ Worked!', r.results.length, 'results');
    } catch (e) {
        console.log('✗ Failed:', e.message);
    }

    // Try method 3: databases.retrieve then find pages
    try {
        console.log('\nTry 3: List all methods on notion');
        console.log('notion methods:', Object.keys(notion));
    } catch (e) {
        console.log('✗ Failed:', e.message);
    }
}

findQueryMethod();
