'use client';

interface CompanionAvatarProps {
  isOnline?: boolean;
  isSpeaking?: boolean;
  status: 'idle' | 'listening' | 'thinking' | 'speaking';
}

function SaathiAvatar({ size = 32 }: { size?: number }) {
  const id = `avatar-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="32" cy="32" r="32" fill={`url(#${id}-bg)`} />
      {/* Subtle inner shadow for depth */}
      <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      {/* Head */}
      <circle cx="32" cy="26" r="11" fill={`url(#${id}-skin)`} />
      {/* Hair — side-parted bob */}
      <ellipse cx="32" cy="21" rx="12" ry="9" fill="#3D2B1F" />
      <ellipse cx="26" cy="23" rx="4" ry="7" fill="#3D2B1F" />
      <ellipse cx="38" cy="23" rx="3.5" ry="6" fill="#3D2B1F" />
      {/* Hair shine */}
      <ellipse cx="30" cy="17" rx="5" ry="2.5" fill="#5C3D2E" opacity="0.5" />
      {/* Eyes */}
      <ellipse cx="28" cy="27" rx="1.6" ry="1.8" fill="#2D1B14" />
      <ellipse cx="36" cy="27" rx="1.6" ry="1.8" fill="#2D1B14" />
      {/* Eye highlights */}
      <circle cx="28.6" cy="26.2" r="0.6" fill="white" />
      <circle cx="36.6" cy="26.2" r="0.6" fill="white" />
      {/* Blush */}
      <ellipse cx="25" cy="30" rx="2.5" ry="1.2" fill="#F87171" opacity="0.3" />
      <ellipse cx="39" cy="30" rx="2.5" ry="1.2" fill="#F87171" opacity="0.3" />
      {/* Smile */}
      <path d="M29 31.5C30 33 34 33 35 31.5" stroke="#2D1B14" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Bindi */}
      <circle cx="32" cy="23.5" r="0.8" fill="#E8332A" />
      {/* Body/shoulders */}
      <path d="M18 52C18 43 24 39 32 39C40 39 46 43 46 52" fill={`url(#${id}-dress)`} />
      {/* Dupatta drape */}
      <path d="M22 44C24 41 28 39.5 32 39.5" stroke="#D42B23" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <defs>
        <linearGradient id={`${id}-bg`} x1="8" y1="8" x2="56" y2="56">
          <stop stopColor="#FEE2E2" />
          <stop offset="1" stopColor="#FECACA" />
        </linearGradient>
        <linearGradient id={`${id}-skin`} x1="24" y1="18" x2="38" y2="36">
          <stop stopColor="#FDDCB5" />
          <stop offset="1" stopColor="#F0C8A0" />
        </linearGradient>
        <linearGradient id={`${id}-dress`} x1="18" y1="39" x2="46" y2="52">
          <stop stopColor="#E8332A" />
          <stop offset="1" stopColor="#D42B23" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const statusConfig: Record<string, { text: string; showPulse: boolean }> = {
  idle: { text: 'Online', showPulse: false },
  listening: { text: 'सुन रही हूँ...', showPulse: true },
  thinking: { text: 'सोच रही हूँ...', showPulse: true },
  speaking: { text: 'बोल रही हूँ...', showPulse: true },
};

export default function CompanionAvatar({ status }: CompanionAvatarProps) {
  const { text, showPulse } = statusConfig[status] ?? statusConfig.idle;

  return (
    <div className="bg-white/80 border-b border-stone-100/60 safe-top"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="relative">
          <SaathiAvatar size={36} />
          {/* Online indicator */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-[1.5px] border-white ${
            showPulse ? 'bg-bounce-500 anim-status-pulse' : 'bg-emerald-400'
          }`} />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-[15px] font-semibold text-ink-primary leading-tight tracking-[-0.01em]">
            Saathi
          </h1>
          <div className="flex items-center gap-1.5 h-4">
            {showPulse && (
              <div className="w-1.5 h-1.5 rounded-full bg-bounce-500 anim-status-pulse" />
            )}
            <span className={`text-[11px] leading-none transition-all duration-300 ${
              showPulse ? 'text-bounce-500 font-medium' : 'text-ink-tertiary'
            }`}>
              {text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SaathiAvatar };
