import { VOICE_CONFIG } from './constants';

export async function synthesizeSpeech(text: string): Promise<ReadableStream> {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not set');
  }

  const voiceId = VOICE_CONFIG.VOICE_ID;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: VOICE_CONFIG.MODEL_ID,
        voice_settings: {
          stability: VOICE_CONFIG.STABILITY,
          similarity_boost: VOICE_CONFIG.SIMILARITY_BOOST,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  if (!response.body) {
    throw new Error('No response body from ElevenLabs');
  }

  return response.body;
}
