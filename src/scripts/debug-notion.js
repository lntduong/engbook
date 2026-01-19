const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

try {
    const envConfig = fs.readFileSync(path.resolve(__dirname, '../../.env.local'), 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.error('Could not read .env.local');
}

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

async function debug() {
    try {
        console.log('Checking Database ID:', databaseId);
        const response = await notion.databases.retrieve({ database_id: databaseId });
        console.log('Full Response:', JSON.stringify(response, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        if (error.body) console.error('Error Body:', error.body);
    }
}

debug();
