'use client';

interface StatusIndicatorProps {
  status: 'idle' | 'listening' | 'processing' | 'thinking' | 'speaking';
}

const statusConfig = {
  idle: { text: '', color: '' },
  listening: { text: 'सुन रही हूँ...', color: 'bg-blue-500' },
  processing: { text: 'समझ रही हूँ...', color: 'bg-yellow-500' },
  thinking: { text: 'सोच रही हूँ...', color: 'bg-purple-500' },
  speaking: { text: 'बोल रही हूँ...', color: 'bg-green-500' },
};

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status === 'idle') return null;

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-center py-2 px-4 bg-orange-50">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
        <span className="text-sm text-stone-600 font-medium">{config.text}</span>
      </div>
    </div>
  );
}
