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
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

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
        let text = response.text();

        // Cleanup markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(text);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Gemini API Error Full:', error);
        console.error('Gemini API Error Message:', error.message);
        return NextResponse.json({ error: 'Failed to generate content', details: error.message }, { status: 500 });
    }
}
