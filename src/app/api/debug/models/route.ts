import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Access the model manager to list models
        // Note: The SDK might not expose listModels directly on genAI instance in all versions, 
        // but let's try the standard way via the API fetch if SDK falls short, 
        // or check if there's a manager. 
        // Actually for google-generative-ai SDK, currently there isn't a direct listModels helper 
        // on the main class in some versions. 
        // Let's try a direct fetch to the REST API using the key.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to list models', details: error.message }, { status: 500 });
    }
}
