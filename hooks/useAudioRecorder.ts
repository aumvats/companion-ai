'use client';

import { useState, useRef, useCallback } from 'react';
import { AUDIO_CONFIG } from '@/lib/constants';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  audioBlob: Blob | null;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearAudio: () => void;
  transcribeAudio: () => Promise<string | null>;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const getSupportedMimeType = useCallback((): string => {
    for (const mimeType of AUDIO_CONFIG.MIME_TYPES) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType;
      }
    }
    return 'audio/webm'; // fallback
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];

      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('आपका ब्राउज़र माइक्रोफोन सपोर्ट नहीं करता');
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia(
        AUDIO_CONFIG.CONSTRAINTS
      );

      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setIsRecording(false);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('रिकॉर्डिंग में समस्या हुई');
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(AUDIO_CONFIG.TIME_SLICE);
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('माइक्रोफोन की अनुमति नहीं मिली। कृपया अनुमति दें।');
        } else if (err.name === 'NotFoundError') {
          setError('माइक्रोफोन नहीं मिला');
        } else {
          setError(err.message);
        }
      } else {
        setError('रिकॉर्डिंग शुरू नहीं हो सकी');
      }
      setIsRecording(false);
    }
  }, [getSupportedMimeType]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const clearAudio = useCallback(() => {
    setAudioBlob(null);
    chunksRef.current = [];
  }, []);

  const transcribeAudio = useCallback(async (): Promise<string | null> => {
    if (!audioBlob) {
      setError('कोई ऑडियो नहीं है');
      return null;
    }

    try {
      setError(null);

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/stt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Transcription failed');
      }

      return data.text;
    } catch (err) {
      console.error('Transcription error:', err);
      setError('ऑडियो को टेक्स्ट में बदलने में समस्या हुई');
      return null;
    }
  }, [audioBlob]);

  return {
    isRecording,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    clearAudio,
    transcribeAudio,
  };
}
