'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useTTS } from '@/hooks/useTTS';
import CompanionAvatar from '@/components/CompanionAvatar';
import ChatContainer from '@/components/ChatContainer';
import VoiceMode from '@/components/VoiceMode';

export default function Home() {
  const {
    messages,
    streamingText,
    isRecording,
    isProcessing,
    isCompanionSpeaking,
    error,
    sendMessage,
    setRecording,
    setCompanionSpeaking,
    clearError,
  } = useChat();

  const {
    isRecording: isAudioRecording,
    stream: audioStream,
    startRecording,
    stopRecording,
    transcribeAudio,
    error: audioError,
  } = useAudioRecorder();

  const {
    isPlaying: isSpeaking,
    speak,
    error: ttsError,
  } = useTTS();

  const [inputText, setInputText] = useState('');
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const voiceModeExitTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCompanionSpeaking(isSpeaking);
  }, [isSpeaking, setCompanionSpeaking]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'companion' && lastMessage.content && !isSpeaking) {
        speak(lastMessage.content);
      }
    }
  }, [messages, speak, isSpeaking]);

  // Exit voice mode when done recording + processing
  useEffect(() => {
    if (isVoiceModeActive && !isAudioRecording && !isProcessing) {
      voiceModeExitTimer.current = setTimeout(() => {
        setIsVoiceModeActive(false);
      }, 300);
    }
    return () => {
      if (voiceModeExitTimer.current) {
        clearTimeout(voiceModeExitTimer.current);
      }
    };
  }, [isVoiceModeActive, isAudioRecording, isProcessing]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const message = inputText.trim();
    setInputText('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartRecording = useCallback(async () => {
    setIsVoiceModeActive(true);
    setRecording(true);
    await startRecording();
  }, [setRecording, startRecording]);

  const handleStopRecording = useCallback(async () => {
    setRecording(false);
    const blob = await stopRecording();
    if (blob) {
      const transcript = await transcribeAudio(blob);
      if (transcript) {
        await sendMessage(transcript);
      }
    }
  }, [setRecording, stopRecording, transcribeAudio, sendMessage]);

  const handleQuickAction = useCallback(async (text: string) => {
    await sendMessage(text);
  }, [sendMessage]);

  const getStatus = (): 'idle' | 'listening' | 'thinking' | 'speaking' => {
    if (isRecording) return 'listening';
    if (isProcessing) return 'thinking';
    if (isCompanionSpeaking) return 'speaking';
    return 'idle';
  };

  const activeError = error || audioError || ttsError;
  const micDisabled = isProcessing || isCompanionSpeaking;
  const hasText = inputText.trim().length > 0;

  return (
    <div className="flex flex-col h-[100dvh] bg-surface-primary">
      {/* Header */}
      <CompanionAvatar
        isOnline={true}
        isSpeaking={isCompanionSpeaking}
        status={getStatus()}
      />

      {/* Error toast */}
      {activeError && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 text-[13px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="flex-1">{activeError}</span>
          <button type="button" onClick={clearError} aria-label="Dismiss" className="p-1 text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Chat */}
      <ChatContainer
        messages={messages}
        streamingText={streamingText}
        isCompanionSpeaking={isCompanionSpeaking}
        isProcessing={isProcessing}
        onQuickAction={handleQuickAction}
      />

      {/* Input bar */}
      <div className="input-bar-glass px-3 py-2 safe-bottom">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="टाइप करें..."
              disabled={isProcessing || isAudioRecording}
              className="w-full px-4 py-2.5 bg-surface-primary border border-stone-200 rounded-full text-[15px] text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-bounce-400 focus:ring-1 focus:ring-bounce-400/20 disabled:opacity-50 transition-colors"
            />
          </div>

          {/* Morphing action button */}
          <button
            type="button"
            onClick={hasText ? handleSend : undefined}
            onPointerDown={!hasText && !micDisabled ? () => handleStartRecording() : undefined}
            onPointerUp={!hasText && isAudioRecording ? () => handleStopRecording() : undefined}
            onPointerLeave={!hasText && isAudioRecording ? () => handleStopRecording() : undefined}
            disabled={hasText ? isProcessing : micDisabled}
            aria-label={hasText ? 'Send message' : 'Hold to record'}
            className={`relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 touch-none select-none transition-all duration-200 ease-spring
              ${isAudioRecording
                ? 'bg-bounce-500 scale-110 shadow-lg shadow-bounce-500/30'
                : 'bg-bounce-500 shadow-md shadow-bounce-500/20 hover:bg-bounce-600 active:scale-90'
              }
              ${(hasText ? isProcessing : micDisabled) ? 'opacity-40 cursor-not-allowed' : ''}
            `}
          >
            {/* Send icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className={`w-5 h-5 ml-0.5 absolute transition-all duration-200 ${
                hasText ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
            {/* Mic icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className={`w-5 h-5 absolute transition-all duration-200 ${
                hasText ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
              }`}
            >
              <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 0 1 2 0z" />
              <rect x="11" y="19" width="2" height="3" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Voice Mode overlay */}
      <VoiceMode
        isActive={isVoiceModeActive}
        isRecording={isAudioRecording}
        isProcessing={isProcessing}
        stream={audioStream}
      />
    </div>
  );
}
