'use client';

import { useState, useRef, useCallback } from 'react';

interface UseTTSReturn {
  isPlaying: boolean;
  error: string | null;
  speak: (text: string) => Promise<void>;
  stop: () => void;
}

export function useTTS(): UseTTSReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      setError(null);

      // Stop any currently playing audio
      stop();

      // Fetch TTS audio
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      // Convert response to blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setError('ऑडियो प्ले करने में समस्या हुई');
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setError('बोलने में समस्या हुई');
      setIsPlaying(false);
    }
  }, [stop]);

  return {
    isPlaying,
    error,
    speak,
    stop,
  };
}
