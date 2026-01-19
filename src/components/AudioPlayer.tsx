'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
    audioUrl: string;
    episodeId: string;
    onPlay?: () => void;
    shouldPause?: boolean;
}

export default function AudioPlayer({ audioUrl, episodeId, onPlay, shouldPause }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Pause when shouldPause changes
    useEffect(() => {
        if (shouldPause && isPlaying) {
            handlePause();
        }
    }, [shouldPause]);

    const handlePlay = () => {
        if (!audioRef.current) return;

        // Notify parent that this player is playing
        onPlay?.();

        audioRef.current.play();
        setIsPlaying(true);
    };

    const handlePause = () => {
        if (!audioRef.current) return;

        audioRef.current.pause();
        setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (!audioRef.current) return;
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;

        const newTime = parseFloat(e.target.value);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;

        const newVolume = parseFloat(e.target.value);
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;

        if (isMuted) {
            audioRef.current.volume = volume || 0.5;
            setIsMuted(false);
        } else {
            audioRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const handleSpeedChange = () => {
        if (!audioRef.current) return;

        const speeds = [1, 1.25, 1.5, 2];
        const currentIndex = speeds.indexOf(playbackRate);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];

        audioRef.current.playbackRate = newSpeed;
        setPlaybackRate(newSpeed);
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="my-4">
            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Mobile: Two-row layout */}
            <div className="flex flex-col gap-2 sm:hidden">
                {/* Mobile Row 1: Play, Time, Seek */}
                <div className="flex items-center gap-2">
                    {/* Play/Pause Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={isPlaying ? handlePause : handlePlay}
                        className="flex-shrink-0 h-9 w-9"
                    >
                        {isPlaying ? (
                            <Pause className="h-4 w-4" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                    </Button>

                    {/* Time Display */}
                    <span className="text-xs text-slate-600 flex-shrink-0 min-w-[70px]">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {/* Progress Bar */}
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                {/* Mobile Row 2: Volume and Speed */}
                <div className="flex items-center justify-between gap-2">
                    {/* Volume Control */}
                    <div className="flex items-center gap-1.5 flex-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="h-8 w-8 flex-shrink-0"
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX className="h-4 w-4" />
                            ) : (
                                <Volume2 className="h-4 w-4" />
                            )}
                        </Button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    {/* Playback Speed */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSpeedChange}
                        className="flex-shrink-0 min-w-[55px] h-8 text-xs"
                    >
                        {playbackRate}x
                    </Button>
                </div>
            </div>

            {/* Desktop: Single-row layout (Original) */}
            <div className="hidden sm:flex items-center gap-3">
                {/* Play/Pause Button */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="flex-shrink-0"
                >
                    {isPlaying ? (
                        <Pause className="h-4 w-4" />
                    ) : (
                        <Play className="h-4 w-4" />
                    )}
                </Button>

                {/* Time Display */}
                <span className="text-sm text-slate-600 flex-shrink-0 min-w-[80px]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Progress Bar */}
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                {/* Volume Control */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="h-8 w-8"
                    >
                        {isMuted || volume === 0 ? (
                            <VolumeX className="h-4 w-4" />
                        ) : (
                            <Volume2 className="h-4 w-4" />
                        )}
                    </Button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                {/* Playback Speed */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSpeedChange}
                    className="flex-shrink-0 min-w-[60px]"
                >
                    {playbackRate}x
                </Button>
            </div>
        </div>
    );
}
