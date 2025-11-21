// Debug script to check Grammar database connection
// Run with: node debug-grammar-connection.js

require('dotenv').config({ path: '.env.local' });

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const GRAMMAR_DB_ID = process.env.NOTION_GRAMMAR_DATABASE_ID;
const VOCAB_DB_ID = process.env.NOTION_DATABASE_ID;

console.log('🔍 GRAMMAR DATABASE CONNECTION DEBUG\n');
console.log('='.repeat(60));

// Step 1: Check environment variables
console.log('\n📋 Step 1: Checking Environment Variables');
console.log('-'.repeat(60));
console.log('NOTION_TOKEN:', NOTION_TOKEN ? `✅ Set (${NOTION_TOKEN.substring(0, 10)}...)` : '❌ Missing');
console.log('VOCAB_DB_ID (working):', VOCAB_DB_ID ? `✅ ${VOCAB_DB_ID}` : '❌ Missing');
console.log('GRAMMAR_DB_ID:', GRAMMAR_DB_ID ? `✅ ${GRAMMAR_DB_ID}` : '❌ Missing');

if (!NOTION_TOKEN || !GRAMMAR_DB_ID) {
    console.log('\n❌ ERROR: Missing required environment variables!');
    console.log('Please check .env.local file.');
    process.exit(1);
}

// Step 2: Test Notion API connection
async function testNotionConnection() {
    console.log('\n📡 Step 2: Testing Notion API Connection');
    console.log('-'.repeat(60));

    try {
        const response = await fetch('https://api.notion.com/v1/users/me', {
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
            },
        });

        if (response.ok) {
            const user = await response.json();
            console.log('✅ Notion API connection successful');
            console.log(`   User: ${user.name || 'Bot'} (${user.type})`);
            return true;
        } else {
            const error = await response.json();
            console.log('❌ Notion API connection failed:', error.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Network error:', error.message);
        return false;
    }
}

// Step 3: Check if Grammar database exists and is accessible
async function checkGrammarDatabase() {
    console.log('\n📊 Step 3: Checking Grammar Database Access');
    console.log('-'.repeat(60));

    try {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${GRAMMAR_DB_ID}`,
            {
                headers: {
                    'Authorization': `Bearer ${NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28',
                },
            }
        );

        if (response.ok) {
            const db = await response.json();
            console.log('✅ Grammar database found and accessible!');
            console.log(`   Title: ${db.title?.[0]?.plain_text || 'Untitled'}`);
            console.log(`   Created: ${new Date(db.created_time).toLocaleDateString()}`);

            // Check properties
            console.log('\n   Properties:');
            Object.keys(db.properties).forEach(prop => {
                console.log(`   - ${prop} (${db.properties[prop].type})`);
            });

            return true;
        } else {
            const error = await response.json();
            console.log('❌ Cannot access Grammar database');
            console.log(`   Error: ${error.message}`);
            console.log(`   Code: ${error.code}`);

            if (error.code === 'object_not_found') {
                console.log('\n💡 Possible reasons:');
                console.log('   1. Database ID is incorrect');
                console.log('   2. Database has not been shared with the integration');
                console.log('   3. Database was deleted');
            }

            return false;
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
        return false;
    }
}

// Step 4: Try to query Grammar database
async function queryGrammarDatabase() {
    console.log('\n🔎 Step 4: Querying Grammar Database for Data');
    console.log('-'.repeat(60));

    try {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${GRAMMAR_DB_ID}/query`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Query successful! Found ${data.results.length} items`);

            if (data.results.length > 0) {
                console.log('\n   Sample items:');
                data.results.slice(0, 3).forEach((item, idx) => {
                    const title = item.properties.Title?.title?.[0]?.plain_text || 'Untitled';
                    const level = item.properties.Level?.select?.name || 'N/A';
                    const category = item.properties.Category?.select?.name || 'N/A';
                    console.log(`   ${idx + 1}. ${title} (${level}, ${category})`);
                });
            } else {
                console.log('\n   ⚠️ Database is empty (no grammar topics yet)');
            }

            return true;
        } else {
            const error = await response.json();
            console.log('❌ Query failed:', error.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
        return false;
    }
}

// Step 5: Compare with working Vocabulary database
async function compareWithVocabDatabase() {
    console.log('\n📊 Step 5: Comparing with Vocabulary Database (Working)');
    console.log('-'.repeat(60));

    try {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${VOCAB_DB_ID}`,
            {
                headers: {
                    'Authorization': `Bearer ${NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28',
                },
            }
        );

        if (response.ok) {
            console.log('✅ Vocabulary database is accessible');
            console.log('\n💡 Both databases should work the same way if:');
            console.log('   1. Both are shared with the same integration');
            console.log('   2. Both database IDs are correct in .env.local');
        } else {
            console.log('❌ Cannot access Vocabulary database either!');
            console.log('   This suggests a problem with the integration itself.');
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

// Run all checks
async function runDiagnostics() {
    const apiOk = await testNotionConnection();

    if (!apiOk) {
        console.log('\n❌ Cannot proceed - Fix Notion API connection first');
        return;
    }

    const dbOk = await checkGrammarDatabase();

    if (dbOk) {
        await queryGrammarDatabase();
    }

    await compareWithVocabDatabase();

    console.log('\n' + '='.repeat(60));
    console.log('🏁 DIAGNOSIS COMPLETE\n');

    if (dbOk) {
        console.log('✅ Grammar database connection is working!');
        console.log('   If the app still shows "No grammar topics", try:');
        console.log('   1. Restart dev server: npm run dev');
        console.log('   2. Hard refresh browser: Ctrl+Shift+R');
    } else {
        console.log('❌ Grammar database connection failed!');
        console.log('\n📝 ACTION REQUIRED:');
        console.log('   1. Go to Notion → Open Grammar database');
        console.log('   2. Click "..." menu → Connections');
        console.log('   3. Add "Eng Notebook App" integration');
        console.log('   4. Ensure it has "Can edit" permission');
        console.log('   5. Re-run this script');
    }
}

runDiagnostics();
