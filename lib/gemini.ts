import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GEMINI_CONFIG } from './constants';
import { Message } from '@/types';

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  if (!model) {
    model = genAI.getGenerativeModel({
      model: GEMINI_CONFIG.MODEL,
      generationConfig: {
        maxOutputTokens: GEMINI_CONFIG.MAX_TOKENS,
        temperature: GEMINI_CONFIG.TEMPERATURE,
      },
    });
  }

  return model;
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function* streamChatResponse(
  systemPrompt: string,
  conversationHistory: Message[],
  userMessage: string
): AsyncGenerator<string, void, unknown> {
  const model = getModel();

  // Convert conversation history to Gemini format
  const history: ChatMessage[] = [];

  // Add system prompt as first message if no history
  if (conversationHistory.length === 0) {
    history.push({
      role: 'user',
      parts: [{ text: systemPrompt }],
    });
    history.push({
      role: 'model',
      parts: [{ text: 'Namaste! Main Saathi hoon. Kaise ho? Aaj ka din kaisa chal raha hai?' }],
    });
  }

  // Add conversation history
  conversationHistory.forEach((msg) => {
    history.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  });

  // Start chat with history
  const chat = model.startChat({
    history,
  });

  // Just send the user message - system prompt is in history
  const messageToSend = userMessage;

  // Stream the response
  const result = await chat.sendMessageStream(messageToSend);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      yield text;
    }
  }
}

export async function generateResponse(
  systemPrompt: string,
  conversationHistory: Message[],
  userMessage: string
): Promise<string> {
  const model = getModel();

  const history: ChatMessage[] = [];

  if (conversationHistory.length === 0) {
    history.push({
      role: 'user',
      parts: [{ text: systemPrompt }],
    });
    history.push({
      role: 'model',
      parts: [{ text: 'Namaste! Main Saathi hoon. Kaise ho?' }],
    });
  }

  conversationHistory.forEach((msg) => {
    history.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  });

  const chat = model.startChat({
    history,
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
