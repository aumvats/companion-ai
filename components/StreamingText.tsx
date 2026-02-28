'use client';

interface StreamingTextProps {
  text: string;
}

export default function StreamingText({ text }: StreamingTextProps) {
  return (
    <p className="text-ink-primary text-[15px] leading-[1.55] whitespace-pre-wrap break-words">
      {text}
      <span className="inline-block w-[2px] h-[14px] ml-0.5 bg-bounce-500 animate-status-pulse rounded-full align-middle" />
    </p>
  );
}
