'use client';

import { useReducer, useCallback } from 'react';
import { ChatState, ChatAction, Message } from '@/types';

const initialState: ChatState = {
  conversationId: null,
  messages: [],
  isRecording: false,
  isProcessing: false,
  isCompanionSpeaking: false,
  streamingText: '',
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CONVERSATION_ID':
      return { ...state, conversationId: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_STREAMING_TEXT':
      return { ...state, streamingText: action.payload };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_COMPANION_SPEAKING':
      return { ...state, isCompanionSpeaking: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_STREAMING_TEXT':
      return { ...state, streamingText: '' };
    case 'LOAD_MESSAGES':
      return { ...state, messages: action.payload };
    default:
      return state;
  }
}

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = useCallback(
    async (content: string) => {
      try {
        // Add user message
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          role: 'user',
          content,
          timestamp: new Date(),
        };

        dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
        dispatch({ type: 'SET_PROCESSING', payload: true });
        dispatch({ type: 'UPDATE_STREAMING_TEXT', payload: '' });

        // Call chat API with SSE
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            history: state.messages,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        // Read SSE stream
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));

                  if (data.error) {
                    throw new Error(data.error);
                  }

                  if (data.done) {
                    // Add complete companion message
                    const companionMessage: Message = {
                      id: `companion-${Date.now()}`,
                      role: 'companion',
                      content: accumulatedText,
                      timestamp: new Date(),
                    };
                    dispatch({ type: 'ADD_MESSAGE', payload: companionMessage });
                    dispatch({ type: 'CLEAR_STREAMING_TEXT' });
                    dispatch({ type: 'SET_PROCESSING', payload: false });
                  } else if (data.token) {
                    accumulatedText += data.token;
                    dispatch({ type: 'UPDATE_STREAMING_TEXT', payload: accumulatedText });
                  }
                } catch (e) {
                  console.error('Failed to parse SSE data:', e);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to send message',
        });
        dispatch({ type: 'SET_PROCESSING', payload: false });
      }
    },
    [state.messages]
  );

  const setRecording = useCallback((recording: boolean) => {
    dispatch({ type: 'SET_RECORDING', payload: recording });
  }, []);

  const setCompanionSpeaking = useCallback((speaking: boolean) => {
    dispatch({ type: 'SET_COMPANION_SPEAKING', payload: speaking });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  return {
    ...state,
    sendMessage,
    setRecording,
    setCompanionSpeaking,
    clearError,
  };
}
