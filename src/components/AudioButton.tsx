'use client';

import { Volume2 } from 'lucide-react';
import { useState } from 'react';

interface AudioButtonProps {
    text: string;
}

export default function AudioButton({ text }: AudioButtonProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US'; // Default to US English

            // Optional: Try to find a specific English voice
            const voices = window.speechSynthesis.getVoices();
            const englishVoice = voices.find(voice => voice.lang.includes('en-US') || voice.lang.includes('en-GB'));
            if (englishVoice) {
                utterance.voice = englishVoice;
            }

            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);

            window.speechSynthesis.cancel(); // Cancel any previous speech
            window.speechSynthesis.speak(utterance);
        } else {
            console.warn('Web Speech API not supported');
        }
    };

    return (
        <button
            onClick={handlePlay}
            className={`p-1 rounded-full hover:bg-blue-50 transition-colors ${isPlaying ? 'text-blue-600' : 'text-gray-400'}`}
            title="Listen"
        >
            <Volume2 className="w-4 h-4" />
        </button>
    );
}
