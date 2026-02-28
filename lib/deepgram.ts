import { DEEPGRAM_CONFIG } from './constants';

export async function transcribeAudio(audioBuffer: Buffer, mimeType?: string): Promise<string> {
  if (!process.env.DEEPGRAM_API_KEY) {
    throw new Error('DEEPGRAM_API_KEY is not set');
  }

  try {
    // Use Deepgram REST API directly
    const response = await fetch(
      `https://api.deepgram.com/v1/listen?model=${DEEPGRAM_CONFIG.MODEL}&language=${DEEPGRAM_CONFIG.LANGUAGE}&smart_format=${DEEPGRAM_CONFIG.SMART_FORMAT}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': mimeType || 'audio/webm',
        },
        body: new Uint8Array(audioBuffer),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Deepgram API error: ${errorText}`);
    }

    const result = await response.json();
    const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript;

    if (!transcript) {
      throw new Error('No transcript returned from Deepgram');
    }

    return transcript;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}
