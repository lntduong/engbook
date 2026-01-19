'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        YG: any;
        onYouglishAPIReady: () => void;
    }
}

interface YouGlishWidgetProps {
    query: string;
    width?: number;
    height?: number;
    components?: number;
    autoStart?: number;
}

export default function YouGlishWidget({
    query,
    width = 640,
    height = 360,
    components = 255, // Default to all components
    autoStart = 1
}: YouGlishWidgetProps) {
    const widgetRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);
    const containerId = 'youglish-widget-container';

    useEffect(() => {
        // Load YouGlish API script if not already loaded
        if (!window.YG) {
            const script = document.createElement('script');
            script.src = 'https://youglish.com/public/emb/widget.js';
            script.async = true;
            document.body.appendChild(script);

            window.onYouglishAPIReady = () => {
                setIsReady(true);
            };
        } else {
            setIsReady(true);
        }

        return () => {
            // Cleanup if needed, though YouGlish API doesn't provide explicit destroy
            if (widgetRef.current) {
                try {
                    widgetRef.current.close();
                } catch (e) {
                    console.warn('Error closing YouGlish widget:', e);
                }
            }
        };
    }, []);

    useEffect(() => {
        if (isReady && window.YG) {
            if (!widgetRef.current) {
                // Initialize widget
                widgetRef.current = new window.YG.Widget(containerId, {
                    width,
                    components,
                    events: {
                        'onFetchDone': (event: any) => console.log('Fetch done:', event),
                        'onVideoChange': (event: any) => console.log('Video change:', event),
                        'onError': (event: any) => console.error('YouGlish error:', event)
                    }
                });
            }

            // Fetch query
            if (query) {
                widgetRef.current.fetch(query, 'english');
            }
        }
    }, [isReady, query, width, components]);

    return (
        <div className="flex justify-center">
            <div id={containerId} style={{ width: width, height: height }}></div>
        </div>
    );
}
