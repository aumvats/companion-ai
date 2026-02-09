import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/deepgram';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert blob to buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get mime type
    const mimeType = audioFile.type || 'audio/webm';

    // Transcribe using Deepgram
    const transcript = await transcribeAudio(buffer, mimeType);

    return NextResponse.json({
      text: transcript,
      language: 'hi',
      success: true,
    });
  } catch (error) {
    console.error('STT API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Transcription failed',
        success: false,
      },
      { status: 500 }
    );
  }
}
