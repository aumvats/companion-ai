'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface AudioWaveformProps {
  stream: MediaStream | null;
  isRecording: boolean;
  barCount?: number;
  barColor?: string;
  barWidth?: number;
  maxHeight?: number;
  gap?: number;
  className?: string;
  renderBars?: boolean;
  onLevelsUpdate?: (levels: number[]) => void;
}

export default function AudioWaveform({
  stream,
  isRecording,
  barCount = 40,
  barColor = 'rgba(255,255,255,0.8)',
  barWidth = 3,
  maxHeight = 64,
  gap = 2,
  className = '',
  renderBars = true,
  onLevelsUpdate,
}: AudioWaveformProps) {
  const [levels, setLevels] = useState<number[]>(new Array(barCount).fill(3));
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const onLevelsUpdateRef = useRef(onLevelsUpdate);

  useEffect(() => {
    onLevelsUpdateRef.current = onLevelsUpdate;
  }, [onLevelsUpdate]);

  useEffect(() => {
    if (!stream || !isRecording) {
      setLevels(new Array(barCount).fill(3));
      return;
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.75;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    audioContextRef.current = audioContext;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const update = () => {
      analyser.getByteFrequencyData(dataArray);

      const newLevels: number[] = [];
      const usable = Math.floor(dataArray.length * 0.6);
      const step = Math.max(1, Math.floor(usable / barCount));

      for (let i = 0; i < barCount; i++) {
        const idx = Math.min(i * step, usable - 1);
        let sum = 0;
        const windowSize = Math.min(step, 3);
        for (let j = 0; j < windowSize; j++) {
          sum += dataArray[Math.min(idx + j, dataArray.length - 1)];
        }
        const avg = sum / windowSize;
        const normalized = Math.max(3, (avg / 255) * maxHeight);
        newLevels.push(normalized);
      }

      if (renderBars) {
        setLevels(newLevels);
      }
      onLevelsUpdateRef.current?.(newLevels);
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      source.disconnect();
      audioContext.close();
    };
  }, [stream, isRecording, barCount, maxHeight, renderBars]);

  if (!isRecording || !renderBars) return null;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ height: maxHeight, gap }}
    >
      {levels.map((height, i) => (
        <div
          key={i}
          className="rounded-full transition-[height] duration-[60ms] ease-out"
          style={{
            width: barWidth,
            height,
            backgroundColor: barColor,
          }}
        />
      ))}
    </div>
  );
}
