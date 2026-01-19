import { MetadataRoute } from 'next';
import { getNotes } from '@/lib/notes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Static routes
    const routes = [
        '',
        '/notes',
        '/vocab',
        '/grammar',
        '/reading',
        '/listening',
        '/flashcard',
        '/exercises',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes (Notes)
    const notes = await getNotes();
    const noteRoutes = notes.map((note) => ({
        url: `${baseUrl}/notes/${note.id}`,
        lastModified: new Date(note.lastEdited),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...noteRoutes];
}
