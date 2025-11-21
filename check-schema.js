const { Client } = require('@notionhq/client');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function checkSchema() {
    try {
        const db = await notion.databases.retrieve({ database_id: databaseId });
        console.log('Database:', db.title[0]?.plain_text);
        console.log('\nProperties found:');
        Object.entries(db.properties).forEach(([name, prop]) => {
            console.log(`  - "${name}" (type: ${prop.type})`);
        });

        console.log('\n=== Checking for required properties ===');
        const required = ['Word', 'IPA', 'Meaning', 'Level', 'Type'];
        required.forEach(prop => {
            if (db.properties[prop]) {
                console.log(`✓ "${prop}" exists (${db.properties[prop].type})`);
            } else {
                console.log(`✗ "${prop}" MISSING!`);
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkSchema();
