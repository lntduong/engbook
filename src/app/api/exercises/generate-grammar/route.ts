import { NextResponse } from 'next/server';
import { generateGeminiContent } from '@/lib/gemini';

export async function POST(req: Request) {
    try {
        const { topics, count = 5 } = await req.json();

        if (!topics || !Array.isArray(topics) || topics.length === 0) {
            // Fallback topics if none provided, though frontend should prevent this
            topics.push('General English Grammar');
        }

        // Limit topics to avoid token limits, take random 5 if more
        const selectedTopics = topics.sort(() => 0.5 - Math.random()).slice(0, 5);

        const prompt = `
            Act as an expert English teacher. Generate ${count} multiple-choice **Grammar** questions based on the following context (Titles & Tags): 
            ${selectedTopics.join(', ')}.

            **CRITICAL INSTRUCTIONS**:
            1. **FOCUS ON GRAMMAR RULES**: The questions MUST test verb tenses, sentence structure, prepositions, conditionals, or active/passive voice.
            2. **IGNORE VOCABULARY DEFINITIONS**: Do NOT ask "What does word X mean?" or "Synonym for Y".
            3. **USE TAGS**: If a topic has tags like "Past Simple", "Passive Voice", YOU MUST GENERATE QUESTIONS TESTING THAT SPECIFIC GRAMMAR POINT.
            4. **FORMAT**: Use "Fill-in-the-blank" style sentences where the user chooses the grammatically correct option.
            
            Example of GOOD Question:
            - "She _____ to the market yesterday." (Options: go, went, gone, going) -> Tests Past Simple.
            
            Example of BAD Question (DO NOT DO THIS):
            - "Someone who visits a place is called a..." (Options: Tourist,...) -> Tests Vocabulary.

            The output must be a valid JSON array of objects. Each object must have:
            - "id": A unique string ID.
            - "question": The question text (mostly fill-in-the-blank sentences).
            - "options": An array of 4 distinct answer strings.
            - "correctAnswer": The string corresponding to the correct option.
            - "explanation": A brief explanation of the grammar rule.

            Output ONLY valid JSON.
        `;

        const data = await generateGeminiContent({ prompt });

        if (!Array.isArray(data)) {
            throw new Error('AI did not return an array');
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Grammar Generation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
