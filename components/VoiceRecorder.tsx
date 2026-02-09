'use client';

import { useCallback } from 'react';

interface VoiceRecorderProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
}

export default function VoiceRecorder({
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
  disabled = false,
}: VoiceRecorderProps) {
  const handlePointerDown = useCallback(() => {
    if (!disabled && !isRecording && !isProcessing) {
      onStartRecording();
    }
  }, [disabled, isRecording, isProcessing, onStartRecording]);

  const handlePointerUp = useCallback(() => {
    if (isRecording) {
      onStopRecording();
    }
  }, [isRecording, onStopRecording]);

  const handlePointerLeave = useCallback(() => {
    if (isRecording) {
      onStopRecording();
    }
  }, [isRecording, onStopRecording]);

  return (
    <div className="flex items-center justify-center">
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        disabled={disabled || isProcessing}
        className={`
          relative w-16 h-16 rounded-full flex items-center justify-center
          transition-all duration-200 touch-none select-none
          ${
            isRecording
              ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/50 animate-pulse'
              : 'bg-orange-500 hover:bg-orange-600 shadow-md'
          }
          ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
        `}
        aria-label={isRecording ? 'Recording - Release to stop' : 'Press and hold to record'}
      >
        {isProcessing ? (
          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-8 h-8"
          >
            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 0 1 2 0z" />
            <path d="M11 19.93V22h2v-2.07a7.991 7.991 0 0 0 0-15.86V2h-2v2.07a7.991 7.991 0 0 0 0 15.86z" />
          </svg>
        )}
      </button>

      {!isRecording && !isProcessing && (
        <p className="absolute bottom-20 text-sm text-stone-500 text-center px-4">
          दबाएं रखें और बोलें
        </p>
      )}

      {isRecording && (
        <div className="absolute bottom-20 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-sm font-medium">सुन रही हूँ...</span>
        </div>
      )}
    </div>
  );
}
