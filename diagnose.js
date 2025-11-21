const { Client } = require('@notionhq/client');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const id = process.env.NOTION_DATABASE_ID;

async function diagnose() {
    console.log('Testing ID:', id);
    console.log('\n--- Trying as DATABASE ---');
    try {
        const db = await notion.databases.retrieve({ database_id: id });
        console.log('✓ SUCCESS! This is a Database');
        console.log('Title:', db.title?.[0]?.plain_text);
        console.log('Object type:', db.object);
        console.log('Has properties?', !!db.properties);
        if (db.properties) {
            console.log('Property names:', Object.keys(db.properties));
        }
    } catch (e) {
        console.log('✗ FAILED as database:', e.message);
    }

    console.log('\n--- Trying as PAGE ---');
    try {
        const page = await notion.pages.retrieve({ page_id: id });
        console.log('✓ SUCCESS! This is a Page');
        console.log('Object type:', page.object);
        if (page.properties) {
            console.log('Property names:', Object.keys(page.properties));
        }
    } catch (e) {
        console.log('✗ FAILED as page:', e.message);
    }
}

diagnose();
