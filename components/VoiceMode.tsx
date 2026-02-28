'use client';

import { useEffect, useState, useCallback } from 'react';
import AudioWaveform from './AudioWaveform';
import VoiceOrb from './VoiceOrb';

interface VoiceModeProps {
  isActive: boolean;
  isRecording: boolean;
  isProcessing: boolean;
  stream: MediaStream | null;
}

export default function VoiceMode({ isActive, isRecording, isProcessing, stream }: VoiceModeProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(0);

  // Enter/exit lifecycle
  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      setAnimateOut(false);
    } else if (shouldRender) {
      setAnimateOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setAnimateOut(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isActive, shouldRender]);

  // Timer
  useEffect(() => {
    if (!isRecording) {
      setSeconds(0);
      return;
    }
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleLevelsUpdate = useCallback((levels: number[]) => {
    setAudioLevels(levels);
  }, []);

  if (!shouldRender) return null;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  const orbState = isRecording ? 'recording' : 'processing';

  return (
    <div
      className={`fixed inset-0 z-50 voice-backdrop flex flex-col items-center justify-center ${
        animateOut ? 'anim-voice-out' : 'anim-voice-in'
      }`}
    >
      {/* Hidden audio analyzer for data */}
      <AudioWaveform
        stream={stream}
        isRecording={isRecording}
        barCount={48}
        maxHeight={64}
        renderBars={false}
        onLevelsUpdate={handleLevelsUpdate}
      />

      {/* Status text */}
      <div className="mb-8">
        {isRecording ? (
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-bounce-400 rounded-full anim-status-pulse" />
            <span className="rec-timer text-white/60 text-sm font-medium tracking-wider">
              {timeStr}
            </span>
          </div>
        ) : (
          <p className="text-white/70 text-base font-medium">
            समझ रही हूँ...
          </p>
        )}
      </div>

      {/* The Voice Orb */}
      <VoiceOrb
        audioLevels={audioLevels}
        state={orbState}
        barCount={48}
      />

      {/* Instruction */}
      <p className="mt-12 text-white/30 text-sm">
        {isRecording ? 'छोड़ दें बोलने के बाद' : 'एक पल रुकें'}
      </p>
    </div>
  );
}
