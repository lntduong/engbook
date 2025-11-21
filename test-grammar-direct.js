// Direct test script with hardcoded Database ID
// Run with: node test-grammar-direct.js
require('dotenv').config({ path: '.env.local' });

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const GRAMMAR_DATABASE_ID = '2b1562aaee72805da70fed1a0c7d8f37'; // Hardcoded

const sampleGrammarTopics = [
    {
        title: "Present Simple Tense",
        level: "A1",
        category: "Tenses",
        order: 1,
        structure: "S + V(s/es)",
        explanation: "Simple present tense is used for habitual actions, general truths, and facts.",
        examples: "I eat breakfast every day.\nShe works in a hospital.\nThey live in London.",
        notes: "Remember to add s/es for he/she/it"
    },
    {
        title: "Present Continuous Tense",
        level: "A1",
        category: "Tenses",
        order: 2,
        structure: "S + is/am/are + V-ing",
        explanation: "Present continuous tense is used for actions happening now or temporary situations.",
        examples: "I am studying English now.\nShe is cooking dinner.\nThey are playing football.",
        notes: "Use for actions in progress at the moment of speaking"
    },
    {
        title: "Articles: A, An, The",
        level: "A2",
        category: "Articles",
        order: 1,
        structure: "a/an (indefinite), the (definite)",
        explanation: "Articles are used before nouns. 'A/an' for non-specific items, 'the' for specific items.",
        examples: "I saw a cat. (any cat)\nThe cat is black. (specific cat)\nShe is an engineer.",
        notes: "Use 'an' before vowel sounds (a, e, i, o, u)"
    }
];

async function addGrammarDirectToNotion(topic) {
    try {
        console.log(`\n📝 Adding "${topic.title}" directly to Notion...`);

        const response = await fetch(
            'https://api.notion.com/v1/pages',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parent: { database_id: GRAMMAR_DATABASE_ID },
                    properties: {
                        Title: {
                            title: [{ text: { content: topic.title } }],
                        },
                        Level: {
                            select: { name: topic.level },
                        },
                        Category: {
                            select: { name: topic.category },
                        },
                        Order: {
                            number: topic.order,
                        },
                        Structure: {
                            rich_text: [{ text: { content: topic.structure } }],
                        },
                        Explanation: {
                            rich_text: [{ text: { content: topic.explanation } }],
                        },
                        Examples: {
                            rich_text: [{ text: { content: topic.examples } }],
                        },
                        Notes: {
                            rich_text: [{ text: { content: topic.notes } }],
                        },
                    },
                }),
            }
        );

        if (response.ok) {
            console.log(`✅ Successfully added: ${topic.title}`);
            return true;
        } else {
            const error = await response.json();
            console.error(`❌ Failed to add ${topic.title}:`);
            console.error(JSON.stringify(error, null, 2));
            return false;
        }
    } catch (error) {
        console.error(`❌ Error adding ${topic.title}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Direct Notion API Test');
    console.log('Database ID:', GRAMMAR_DATABASE_ID);
    console.log('Token exists:', !!NOTION_TOKEN);
    console.log('='.repeat(50));

    for (const topic of sampleGrammarTopics) {
        await addGrammarDirectToNotion(topic);
        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Done! Refresh http://localhost:3000/grammar to see the results.');
}

main();
