import { NextResponse } from 'next/server';
import { generateGeminiContent } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const topics = [
            'Technology & Innovation', 'Business & Leadership', 'Emotions & Psychology',
            'Travel & Culture', 'Science & Nature', 'Arts & Literature',
            'Abstract Concepts', 'Daily Life & Society', 'Education & Learning',
            'Philosophy', 'Health & Wellness'
        ];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        // Add a random seed to the prompt to further ensure variance
        const seed = Date.now();

        const prompt = `
            Generate a random English vocabulary word or phrase related to the topic: "${randomTopic}".
            Target level: Intermediate to Advanced (B2-C1).
            It should be a useful word for daily conversation or professional settings.
            AVOID common cliches such as: ubiquitous, serendipity, resilience, ephemeral, plethora.
            Random seed: ${seed}
            
            Generate a JSON object with the following fields:
            - "word": The word or phrase itself.
            - "meaning": The meaning in Vietnamese.
            - "example": A simple, clear example sentence in English containing the word/phrase.
            - "type": The part of speech (noun, verb, adjective, phrase, etc.).
            - "ipa": The standard IPA pronunciation, enclosed in forward slashes.

            Output ONLY valid JSON. Do not include markdown formatting.
        `;

        const data = await generateGeminiContent({
            prompt,
            temperature: 1.2 // Higher temperature for more randomness
        });

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Daily Word Generation Error:', error);
        return NextResponse.json({
            error: 'Failed to generate daily word',
            details: error.message
        }, { status: 500 });
    }
}
