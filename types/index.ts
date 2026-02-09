export interface Message {
  id: string;
  role: 'user' | 'companion';
  content: string;
  audioUrl?: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  conversationId: string | null;
  messages: Message[];
  isRecording: boolean;
  isProcessing: boolean;
  isCompanionSpeaking: boolean;
  streamingText: string;
  error: string | null;
}

export type ChatAction =
  | { type: 'SET_CONVERSATION_ID'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_STREAMING_TEXT'; payload: string }
  | { type: 'SET_RECORDING'; payload: boolean }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_COMPANION_SPEAKING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_STREAMING_TEXT' }
  | { type: 'LOAD_MESSAGES'; payload: Message[] };

export interface VoiceConfig {
  voiceId: string;
  stability: number;
  similarityBoost: number;
}

export interface AudioRecorderState {
  isRecording: boolean;
  audioBlob: Blob | null;
  error: string | null;
}
