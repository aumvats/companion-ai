'use client';

import { Message } from '@/types';
import StreamingText from './StreamingText';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  streamingText?: string;
}

export default function MessageBubble({ message, isStreaming = false, streamingText = '' }: MessageBubbleProps) {
  const isCompanion = message.role === 'companion';

  return (
    <div className={`flex ${isCompanion ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isCompanion
            ? 'bg-white border border-orange-200 shadow-sm'
            : 'bg-orange-500 text-white shadow-md'
        }`}
      >
        {isStreaming ? (
          <StreamingText text={streamingText} isComplete={false} speed={30} />
        ) : (
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        )}

        <div
          className={`text-xs mt-1 ${
            isCompanion ? 'text-stone-400' : 'text-orange-100'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('hi-IN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
