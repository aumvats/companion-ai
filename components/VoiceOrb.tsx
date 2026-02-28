'use client';

import { useMemo } from 'react';

interface VoiceOrbProps {
  audioLevels: number[];
  state: 'recording' | 'processing';
  barCount?: number;
}

export default function VoiceOrb({ audioLevels, state, barCount = 48 }: VoiceOrbProps) {
  const containerSize = 280;
  const orbSize = 180;
  const ringRadius = 110;
  const cx = containerSize / 2;
  const cy = containerSize / 2;

  // Compute average level for orb glow
  const avgLevel = useMemo(() => {
    if (audioLevels.length === 0) return 0;
    const sum = audioLevels.reduce((a, b) => a + b, 0);
    return Math.min(1, (sum / audioLevels.length) / 64);
  }, [audioLevels]);

  // Glow intensity driven by audio
  const glowRadius = 30 + avgLevel * 50;
  const glowOpacity = 0.15 + avgLevel * 0.25;

  const orbShadow = state === 'recording'
    ? `0 0 ${glowRadius}px ${glowRadius * 0.4}px rgba(232, 51, 42, ${glowOpacity}), inset 0 -8px 24px rgba(0,0,0,0.15)`
    : '0 0 30px 8px rgba(232, 51, 42, 0.1), inset 0 -8px 24px rgba(0,0,0,0.15)';

  // Pre-compute bar positions using trigonometry
  const bars = useMemo(() => {
    const positions = [];
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * ringRadius;
      const y = cy + Math.sin(angle) * ringRadius;
      const rotation = (angle * 180) / Math.PI + 90;
      positions.push({ x, y, rotation, angle });
    }
    return positions;
  }, [barCount, cx, cy, ringRadius]);

  return (
    <div
      className="relative"
      style={{ width: containerSize, height: containerSize }}
    >
      {/* The Orb */}
      <div
        className={`voice-orb absolute ${state === 'recording' ? 'voice-orb-recording' : 'voice-orb-processing'}`}
        style={{
          left: (containerSize - orbSize) / 2,
          top: (containerSize - orbSize) / 2,
          width: orbSize,
          height: orbSize,
          boxShadow: orbShadow,
        }}
      />

      {/* Radial Bars */}
      {state === 'recording' && bars.map((bar, i) => {
        const levelIndex = Math.floor((i / barCount) * audioLevels.length);
        const level = audioLevels[levelIndex] ?? 3;
        const normalizedLevel = Math.min(1, level / 64);
        const barHeight = 4 + normalizedLevel * 28;
        const barOpacity = 0.3 + normalizedLevel * 0.5;

        return (
          <div
            key={i}
            className="radial-bar"
            style={{
              left: bar.x - 1.5,
              top: bar.y,
              height: barHeight,
              opacity: barOpacity,
              transform: `rotate(${bar.rotation}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}
