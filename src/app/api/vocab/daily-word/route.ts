import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const modelsToTry = [
            'gemini-flash-lite-latest',
            'gemini-2.0-flash-exp',
            'gemini-flash-latest'
        ];

        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `
                    Generate a random English vocabulary word or phrase suitable for an intermediate to advanced learner (Level B2-C1).
                    It should be a useful word for daily conversation or professional settings.
                    
                    Generate a JSON object with the following fields:
                    - "word": The word or phrase itself.
                    - "meaning": The meaning in Vietnamese.
                    - "example": A simple, clear example sentence in English containing the word/phrase.
                    - "type": The part of speech (noun, verb, adjective, phrase, etc.).
                    - "ipa": The standard IPA pronunciation, enclosed in forward slashes.

                    Output ONLY valid JSON. Do not include markdown formatting.
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();

                // Cleanup markdown if present
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                const data = JSON.parse(text);

                return NextResponse.json({ ...data, _model: modelName });

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
