import { GoogleGenerativeAI } from '@google/generative-ai';

// Centralized model strategy
const MODELS_TO_TRY = [
    'gemini-2.0-flash-exp',     // Newest, often best quality
    'gemini-flash-lite-latest', // Fast, good backup
    'gemini-flash-latest',      // Stable backup
    'gemini-1.5-flash'          // Older stable fallback
];

interface GenerateOptions {
    prompt: string;
    temperature?: number;
    responseSchema?: any; // For structured output if supported by model/SDK version
}

/**
 * Generates content using Google Gemini models with automatic fallback and retry logic.
 * @param options Configuration for the generation
 * @returns The parsed JSON object from the AI response
 */
export async function generateGeminiContent(options: GenerateOptions) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError: Error | null = null;

    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`[Gemini] Attempting model: ${modelName}`);

            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    temperature: options.temperature,
                    // responseMimeType: "application/json" // Note: Can enable this for strictly JSON models if desired
                }
            });

            const result = await model.generateContent(options.prompt);
            const response = await result.response;
            let text = response.text();

            // Automatic cleanup of markdown code blocks
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                const data = JSON.parse(text);
                // Return data with metadata about which model was used
                return { ...data, _model: modelName };
            } catch (jsonError) {
                console.warn(`[Gemini] Model ${modelName} returned invalid JSON:`, text.substring(0, 100) + '...');
                throw new Error(`Invalid JSON response from ${modelName}`);
            }

        } catch (error: any) {
            console.error(`[Gemini] Model ${modelName} failed:`, error.message);

            // Check for specific error types if needed (e.g. 429) to decide if we want to wait before next retry
            // For now, simple failover is sufficient specific for 429s as moving to next model usually helps 
            // if the quota is per-model.

            lastError = error;

            // Wait 2 seconds before trying the next model to avoid rapid-fire rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Continue to next model loop
        }
    }

    throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
}
