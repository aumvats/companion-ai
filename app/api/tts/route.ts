import { NextRequest } from 'next/server';
import { synthesizeSpeech } from '@/lib/elevenlabs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get audio stream from ElevenLabs
    const audioStream = await synthesizeSpeech(text);

    // Return the audio stream
    return new Response(audioStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Text-to-speech failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
