'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useTTS } from '@/hooks/useTTS';
import CompanionAvatar from '@/components/CompanionAvatar';
import ChatContainer from '@/components/ChatContainer';
import StatusIndicator from '@/components/StatusIndicator';
import VoiceRecorder from '@/components/VoiceRecorder';

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
    startRecording,
    stopRecording,
    transcribeAudio,
    error: audioError,
  } = useAudioRecorder();

  const {
    isPlaying: isSpeaking,
    speak,
    stop: stopSpeaking,
    error: ttsError,
  } = useTTS();

  const [inputText, setInputText] = useState('');

  // Update companion speaking state when TTS is playing
  useEffect(() => {
    setCompanionSpeaking(isSpeaking);
  }, [isSpeaking, setCompanionSpeaking]);

  // Auto-play companion responses
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'companion' && lastMessage.content && !isSpeaking) {
        speak(lastMessage.content);
      }
    }
  }, [messages, speak, isSpeaking]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const message = inputText.trim();
    setInputText('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartRecording = async () => {
    setRecording(true);
    await startRecording();
  };

  const handleStopRecording = async () => {
    stopRecording();
    setRecording(false);

    // Wait a bit for the audio to be processed
    setTimeout(async () => {
      const transcript = await transcribeAudio();
      if (transcript) {
        await sendMessage(transcript);
      }
    }, 100);
  };

  const getStatus = () => {
    if (isRecording) return 'listening';
    if (isProcessing) return 'thinking';
    if (isCompanionSpeaking) return 'speaking';
    return 'idle';
  };

  return (
    <div className="flex flex-col h-screen bg-orange-50">
      {/* Header with Companion Avatar */}
      <CompanionAvatar isOnline={true} isSpeaking={isCompanionSpeaking} />

      {/* Status Indicator */}
      <StatusIndicator status={getStatus()} />

      {/* Error Message */}
      {(error || audioError || ttsError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-2 rounded relative">
          <span className="block sm:inline">{error || audioError || ttsError}</span>
          <button
            onClick={clearError}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <ChatContainer
        messages={messages}
        streamingText={streamingText}
        isCompanionSpeaking={isCompanionSpeaking}
      />

      {/* Input Area */}
      <div className="border-t border-orange-200 bg-white px-4 py-6">
        {/* Voice Recorder */}
        <div className="relative mb-4">
          <VoiceRecorder
            isRecording={isAudioRecording}
            isProcessing={isProcessing}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            disabled={isProcessing || isCompanionSpeaking}
          />
        </div>

        {/* Text Input */}
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="या यहाँ लिखें..."
            disabled={isProcessing || isAudioRecording}
            className="flex-1 px-4 py-3 border border-orange-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isProcessing || isAudioRecording}
            className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors min-w-[80px] text-sm"
          >
            भेजें
          </button>
        </div>
      </div>
    </div>
  );
}
