import { NextResponse } from 'next/server';
import { generateGeminiContent } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { topic, level } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const prompt = `
            Generate an English reading passage about the topic: "${topic}".
            Target Level: ${level || 'B1'}.
            
            The response must be in strictly valid JSON format with the following structure:
            {
                "title": "A creative and relevant title",
                "content": "The reading passage text (around 200-300 words). Use paragraphs (\\n\\n) for formatting.",
                "vocab": [
                    { "word": "word1", "type": "noun/verb...", "meaning": "Vietnamese meaning", "example": "Example sentence" }
                    // 5-7 key vocabulary words
                ],
                "grammar": [
                    { "point": "Grammar point name", "explanation": "Brief explanation", "example": "Example sentence from the text" }
                    // 2-3 grammar points found in the text
                ],
                "questions": [
                    { 
                        "question": "Question text?", 
                        "options": ["Option A", "Option B", "Option C", "Option D"], 
                        "correctAnswer": 0 // Index of the correct option (0-3)
                    }
                    // 3-5 reading comprehension questions
                ]
            }

            OUTPUT ONLY JSON. NO MARKDOWN.
        `;

        const data = await generateGeminiContent({ prompt });

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Reading Generation Error:', error);
        return NextResponse.json({ error: 'Generation failed', details: error.message }, { status: 500 });
    }
}
