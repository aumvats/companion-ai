'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import MessageBubble from './MessageBubble';

interface ChatContainerProps {
  messages: Message[];
  streamingText: string;
  isCompanionSpeaking: boolean;
}

export default function ChatContainer({ messages, streamingText, isCompanionSpeaking }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-2"
      style={{ scrollbarWidth: 'thin' }}
    >
      {messages.length === 0 && !streamingText && (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-2xl font-semibold text-stone-800 mb-2">
            नमस्ते! मैं सहेली हूँ
          </h2>
          <p className="text-stone-600">
            आपकी दोस्त, हमेशा आपके साथ। बताओ, आज कैसा चल रहा है?
          </p>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Show streaming message */}
      {streamingText && (
        <MessageBubble
          message={{
            id: 'streaming',
            role: 'companion',
            content: streamingText,
            timestamp: new Date(),
          }}
          isStreaming={true}
          streamingText={streamingText}
        />
      )}

      <div ref={bottomRef} />
    </div>
  );
}
