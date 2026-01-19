import { NextResponse } from 'next/server';
import { generateGeminiContent } from '@/lib/gemini';

export async function POST(req: Request) {
    try {
        const { word } = await req.json();
        if (!word) {
            return NextResponse.json({ error: 'Word is required' }, { status: 400 });
        }

        const prompt = `
            Generate a JSON object for the English vocabulary word or phrase: "${word}".
            The object should have the following fields:
            - "meaning": The meaning in Vietnamese.
            - "example": A simple, clear example sentence in English containing the word/phrase.
            - "type": The part of speech (noun, verb, adjective, phrase, etc.).
            - "ipa": The standard IPA pronunciation, enclosed in forward slashes (e.g. /həˈləʊ/).

            Output ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
        `;

        const data = await generateGeminiContent({ prompt });

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Word Generation Error:', error);
        return NextResponse.json({
            error: 'Failed to generate word details',
            details: error.message
        }, { status: 500 });
    }
}
