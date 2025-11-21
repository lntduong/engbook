// Test different import methods
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

const databaseId = process.env.NOTION_DATABASE_ID;

async function testDifferentApproaches() {
    console.log('=== Test 1: Default import ===');
    try {
        const { Client } = require('@notionhq/client');
        const notion1 = new Client({ auth: process.env.NOTION_TOKEN });
        console.log('notion1.databases methods:', Object.keys(notion1.databases));
        console.log('Has query?', typeof notion1.databases.query);
    } catch (e) {
        console.log('Error:', e.message);
    }

    console.log('\n=== Test 2: Full package import ===');
    try {
        const NotionSDK = require('@notionhq/client');
        console.log('NotionSDK exports:', Object.keys(NotionSDK));
        const notion2 = new NotionSDK.Client({ auth: process.env.NOTION_TOKEN });
        console.log('notion2.databases methods:', Object.keys(notion2.databases));
    } catch (e) {
        console.log('Error:', e.message);
    }

    console.log('\n=== Test 3: Check package version ===');
    try {
        const pkg = require('@notionhq/client/package.json');
        console.log('Package version:', pkg.version);
    } catch (e) {
        console.log('Could not read package.json');
    }

    console.log('\n=== Test 4: Try POST to Notion API directly ===');
    try {
        const https = require('https');
        const options = {
            hostname: 'api.notion.com',
            path: `/v1/databases/${databaseId}/query`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const result = JSON.parse(data);
                console.log('✓ Direct API call worked!');
                console.log('Results:', result.results ? result.results.length : 0);
                if (result.results && result.results.length > 0) {
                    console.log('First word:', result.results[0].properties[' Word '].title[0].plain_text);
                }
            });
        });

        req.on('error', e => console.log('Error:', e.message));
        req.write(JSON.stringify({}));
        req.end();
    } catch (e) {
        console.log('Error:', e.message);
    }
}

testDifferentApproaches();
