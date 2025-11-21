// Test script to add sample grammar data via API
// Run with: node test-add-grammar.js

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

async function addGrammarTopic(topic) {
    try {
        const response = await fetch('http://localhost:3000/api/grammar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(topic),
        });

        if (response.ok) {
            console.log(`✅ Added: ${topic.title}`);
            return true;
        } else {
            const error = await response.json();
            console.error(`❌ Failed to add ${topic.title}:`, error);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error adding ${topic.title}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Starting to add sample grammar topics...\n');

    for (const topic of sampleGrammarTopics) {
        await addGrammarTopic(topic);
        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ Done! Check http://localhost:3000/grammar to see the results.');
}

main();
