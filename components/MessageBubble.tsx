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
    <div className={`flex ${isCompanion ? 'justify-start' : 'justify-end'} mb-2 anim-msg`}>
      <div
        className={`max-w-[80%] px-3.5 py-2.5 ${
          isCompanion
            ? 'bg-white rounded-[20px] rounded-tl-[6px] shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-stone-100/80'
            : 'rounded-[20px] rounded-tr-[6px] shadow-[0_2px_10px_rgba(232,51,42,0.2)]'
        }`}
        style={
          !isCompanion
            ? { background: 'linear-gradient(135deg, #E8332A, #D42B23)' }
            : undefined
        }
      >
        {isStreaming ? (
          <StreamingText text={streamingText} />
        ) : (
          <p className={`whitespace-pre-wrap break-words text-[15px] leading-[1.55] ${
            isCompanion ? 'text-ink-primary' : 'text-white'
          }`}>
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
}
