import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
        }

        const { topic, level } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const modelsToTry = [
            'gemini-flash-lite-latest',
            'gemini-2.0-flash-exp',
            'gemini-flash-latest'
        ];

        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: modelName });

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

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();

                text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const data = JSON.parse(text);

                return NextResponse.json(data);

            } catch (error: any) {
                console.error(`Model ${modelName} failed:`, error.message);
                lastError = error;
            }
        }

        throw lastError;

    } catch (error: any) {
        console.error('Reading Generation Error:', error);
        return NextResponse.json({ error: 'Generation failed', details: error.message }, { status: 500 });
    }
}
