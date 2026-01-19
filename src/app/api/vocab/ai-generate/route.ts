import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
        }

        const { word } = await req.json();
        if (!word) {
            return NextResponse.json({ error: 'Word is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // List of models to try in order of preference.
        // 1.5 models are 404 (Retired/Unavailable in this environment).
        // 2.5 Flash has a strict 20 RPD limit on free tier.
        // Trying Lite and Experimental models which often have separate/better quotas.
        const modelsToTry = [
            'gemini-flash-lite-latest',
            'gemini-2.0-flash-exp',
            'gemini-flash-latest' // Fallback to the one we know works (even if 20/day limit)
        ];

        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting to generate with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `
                    Generate a JSON object for the English vocabulary word or phrase: "${word}".
                    The object should have the following fields:
                    - "meaning": The meaning in Vietnamese.
                    - "example": A simple, clear example sentence in English containing the word/phrase.
                    - "type": The part of speech (noun, verb, adjective, phrase, etc.).
                    - "ipa": The standard IPA pronunciation, enclosed in forward slashes (e.g. /həˈləʊ/).

                    Output ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                // console.log(response.text()); // Debug logging
                let text = response.text();
                console.log(text);

                // Cleanup markdown if present
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                const data = JSON.parse(text);

                // If successful, append which model was used
                return NextResponse.json({ ...data, _model: modelName });

            } catch (error: any) {
                console.error(`Model ${modelName} failed:`, error.message);
                lastError = error;
                // Continue to next model
            }
        }

        // If we get here, all models failed
        console.error('All models failed. Last error:', lastError);
        return NextResponse.json({
            error: 'Failed to generate content with all available models',
            details: lastError?.message
        }, { status: 500 });

    } catch (error: any) {
        // Catch-all for other errors (e.g. API key missing)
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
