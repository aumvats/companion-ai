// Voice configuration
export const VOICE_CONFIG = {
  // ElevenLabs voice ID for Hindi female voice (Rhea - warm, intimate)
  // Replace with actual voice ID from ElevenLabs after signup
  VOICE_ID: process.env.ELEVENLABS_VOICE_ID || 'pMsXgVXv3BLzUgSXRplE',
  STABILITY: 0.5,
  SIMILARITY_BOOST: 0.75,
  MODEL_ID: 'eleven_flash_v2_5',
} as const;

// Gemini configuration
export const GEMINI_CONFIG = {
  MODEL: 'gemini-3-flash-preview',
  MAX_TOKENS: 2048, // Max for better, complete responses
  TEMPERATURE: 0.9, // More natural conversation
} as const;

// Deepgram configuration
export const DEEPGRAM_CONFIG = {
  MODEL: 'nova-2',
  LANGUAGE: 'hi', // Hindi
  SMART_FORMAT: true,
} as const;

// Audio recording configuration
export const AUDIO_CONFIG = {
  MIME_TYPES: [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ],
  CONSTRAINTS: {
    audio: {
      channelCount: 1, // Mono for smaller files
      sampleRate: 16000, // Sufficient for speech
      echoCancellation: true,
      noiseSuppression: true, // Important for outdoor/traffic noise
    },
  },
  TIME_SLICE: 1000, // Get data every second
} as const;

// App configuration
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Saathi',
  MAX_MESSAGE_LENGTH: 500,
  PROACTIVE_CHECK_INTERVAL: 30 * 60 * 1000, // 30 minutes
} as const;
