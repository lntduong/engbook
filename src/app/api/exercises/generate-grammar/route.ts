import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
        }

        const { topics, count = 5 } = await req.json();

        if (!topics || !Array.isArray(topics) || topics.length === 0) {
            // Fallback topics if none provided, though frontend should prevent this
            topics.push('General English Grammar');
        }

        // Limit topics to avoid token limits, take random 5 if more
        const selectedTopics = topics.sort(() => 0.5 - Math.random()).slice(0, 5);

        const genAI = new GoogleGenerativeAI(apiKey);

        // Use the same model list strategy as the vocab generator
        const modelsToTry = [
            'gemini-flash-lite-latest',
            'gemini-2.0-flash-exp',
            'gemini-flash-latest',
            'gemini-1.5-flash'
        ];

        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });

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

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();

                // Cleanup markdown if present
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                const data = JSON.parse(text);

                if (!Array.isArray(data)) {
                    throw new Error('AI did not return an array');
                }

                return NextResponse.json(data);

            } catch (error: any) {
                console.error(`Model ${modelName} failed:`, error.message);
                lastError = error;
            }
        }

        return NextResponse.json({
            error: 'Failed to generate content with all available models',
            details: lastError?.message
        }, { status: 500 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
