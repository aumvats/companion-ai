'use client';

interface StatusIndicatorProps {
  status: 'idle' | 'listening' | 'processing' | 'thinking' | 'speaking';
}

const statusConfig = {
  idle: { text: '', color: '', bg: '' },
  listening: { text: 'सुन रही हूँ...', color: 'bg-bounce-500', bg: 'bg-bounce-50' },
  processing: { text: 'समझ रही हूँ...', color: 'bg-amber-500', bg: 'bg-amber-50' },
  thinking: { text: 'सोच रही हूँ...', color: 'bg-purple-500', bg: 'bg-purple-50' },
  speaking: { text: 'बोल रही हूँ...', color: 'bg-green-500', bg: 'bg-green-50' },
};

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status === 'idle') return null;

  const config = statusConfig[status];

  return (
    <div className={`flex items-center justify-center py-1.5 px-4 ${config.bg}`}>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color} animate-pulse`} />
        <span className="text-xs text-stone-600 font-medium">{config.text}</span>
      </div>
    </div>
  );
}
