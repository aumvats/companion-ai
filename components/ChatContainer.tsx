'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Message } from '@/types';
import MessageBubble from './MessageBubble';
import { SaathiAvatar } from './CompanionAvatar';

interface ChatContainerProps {
  messages: Message[];
  streamingText: string;
  isCompanionSpeaking: boolean;
  isProcessing: boolean;
  onQuickAction?: (text: string) => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'शुभ रात्रि';
  if (hour < 12) return 'सुप्रभात';
  if (hour < 17) return 'नमस्ते';
  return 'शुभ संध्या';
}

function getSubgreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'देर हो गई है, कैसे हो?';
  if (hour < 12) return 'आज का दिन शानदार हो!';
  if (hour < 17) return 'दोपहर कैसी गुज़र रही है?';
  return 'थक गए होंगे, बात करें?';
}

const quickChips = [
  { label: 'आज कैसा दिन है?', icon: '🗓' },
  { label: 'कुछ मज़ेदार सुनाओ', icon: '😊' },
  { label: 'बात करो मुझसे', icon: '💬' },
];

export default function ChatContainer({
  messages,
  streamingText,
  isProcessing,
  onQuickAction,
}: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const greeting = useMemo(() => getGreeting(), []);
  const subgreeting = useMemo(() => getSubgreeting(), []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const showEmpty = messages.length === 0 && !streamingText;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
      style={{ scrollbarWidth: 'none' }}
    >
      {showEmpty ? (
        <div className="flex flex-col items-center justify-center h-full px-6">
          {/* Avatar with float animation */}
          <div className="anim-stagger anim-stagger-0 anim-float mb-6">
            <div className="relative">
              <SaathiAvatar size={88} />
              {/* Soft glow behind avatar */}
              <div className="absolute inset-0 -z-10 rounded-full blur-2xl bg-bounce-200/40 scale-125" />
            </div>
          </div>

          {/* Greeting */}
          <h2 className="anim-stagger anim-stagger-1 text-[30px] font-bold text-ink-primary mb-1.5 tracking-[-0.02em]">
            {greeting}
          </h2>

          {/* Subtitle */}
          <p className="anim-stagger anim-stagger-2 text-[15px] text-ink-secondary mb-1 text-center">
            मैं <span className="font-semibold text-bounce-500">साथी</span> हूँ — आपकी दोस्त
          </p>

          {/* Subgreeting */}
          <p className="anim-stagger anim-stagger-3 text-[13px] text-ink-tertiary mb-10 text-center">
            {subgreeting}
          </p>

          {/* Quick action chips */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {quickChips.map((chip, i) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => onQuickAction?.(chip.label)}
                className={`anim-chip flex items-center gap-2 px-4 py-2.5 bg-white rounded-full text-[13px] text-ink-primary font-medium shadow-[0_1px_8px_rgba(0,0,0,0.06)] border border-stone-100 hover:border-bounce-200 hover:shadow-[0_2px_12px_rgba(232,51,42,0.1)] active:scale-95 transition-all duration-200`}
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <span className="text-base">{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-3 py-4 space-y-0.5">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Streaming */}
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

          {/* Typing indicator */}
          {isProcessing && !streamingText && (
            <div className="flex justify-start mb-2 anim-msg">
              <div className="bg-surface-secondary rounded-[20px] rounded-tl-[6px] px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex gap-1.5 items-center h-5">
                  <div className="typing-dot w-2 h-2 bg-stone-300 rounded-full" />
                  <div className="typing-dot w-2 h-2 bg-stone-300 rounded-full" />
                  <div className="typing-dot w-2 h-2 bg-stone-300 rounded-full" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
