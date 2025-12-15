import { NextResponse } from 'next/server';
import { translate } from 'google-translate-api-x';

export async function POST(req: Request) {
    try {
        const { text, from, to } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Cast the result to any to bypass strict type checking issues with this unofficial library
        const res: any = await translate(text, { from: from || 'auto', to: to || 'en' });

        return NextResponse.json({
            text: res.text,
            from: res.from.language.iso
        });
    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
    }
}
