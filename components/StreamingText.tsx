'use client';

import { useEffect, useState } from 'react';

interface StreamingTextProps {
  text: string;
  isComplete?: boolean;
  speed?: number; // milliseconds per character
}

export default function StreamingText({ text, isComplete = false, speed = 30 }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isComplete) {
      // Show full text immediately when complete
      setDisplayedText(text);
      setCurrentIndex(text.length);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex, isComplete, speed]);

  // Reset when text changes (new message)
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <div className="text-stone-900">
      {displayedText}
      {!isComplete && currentIndex < text.length && (
        <span className="inline-block w-1 h-4 ml-1 bg-orange-500 animate-pulse" />
      )}
    </div>
  );
}
