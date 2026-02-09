'use client';

interface CompanionAvatarProps {
  isOnline?: boolean;
  isSpeaking?: boolean;
}

export default function CompanionAvatar({ isOnline = true, isSpeaking = false }: CompanionAvatarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-orange-100 shadow-sm">
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-semibold ${
            isSpeaking ? 'animate-pulse' : ''
          }`}
        >
          👧
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-lg font-semibold text-stone-800">Saathi</h1>
        <p className="text-sm text-stone-500">
          {isSpeaking ? 'बोल रही हूँ...' : isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
}
