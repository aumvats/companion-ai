# Saathi - Voice Companion for Bounce Daily Riders

A warm, caring Hindi-speaking voice companion for gig delivery riders.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then add your API keys:

#### Get Gemini API Key (Free)
1. Go to [https://ai.google.dev/](https://ai.google.dev/)
2. Click "Get API Key" → "Create API key in new project"
3. Copy the key and add to `.env.local` as `GEMINI_API_KEY=your_key_here`

#### Get Deepgram API Key (Free $200 credits)
1. Sign up at [https://console.deepgram.com/signup](https://console.deepgram.com/signup)
2. Go to API Keys section
3. Copy the key and add to `.env.local` as `DEEPGRAM_API_KEY=your_key_here`

#### Get ElevenLabs API Key (Free 10K chars/month)
1. Sign up at [https://elevenlabs.io/sign-up](https://elevenlabs.io/sign-up)
2. Go to Profile → API Keys
3. Create new API key
4. Add to `.env.local` as `ELEVENLABS_API_KEY=your_key_here`
5. For voice ID, go to Voice Library → Select a Hindi voice (Rhea/Gargi) → Copy voice ID
6. Add to `.env.local` as `ELEVENLABS_VOICE_ID=your_voice_id`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Current Status

### ✅ Phase 1: Text Chat (DONE)
- Hindi-speaking companion persona "Saathi"
- Streaming text responses
- Warm, caring conversation style
- Mobile-responsive UI

### ✅ Phase 2: Voice Input (DONE)
- Press-and-hold to record voice
- Deepgram Hindi speech-to-text
- Automatic transcription and chat

### ✅ Phase 3: Voice Output (DONE)
- ElevenLabs Hindi female voice (natural, warm)
- Auto-play companion responses
- Streaming audio playback

### 🚧 Phase 4: Polish (Optional)
- Conversation persistence
- Proactive messages

## Tech Stack

- **Frontend**: Next.js 15 + Tailwind CSS
- **LLM**: Google Gemini 2.0 Flash
- **STT**: Deepgram Nova-2
- **TTS**: ElevenLabs Flash v2.5
- **Database**: SQLite + Prisma (coming soon)

## Testing the Voice Companion

The app is currently running at **http://localhost:3000**

### Testing Voice-to-Voice Conversation:

1. **Allow microphone access** when prompted (first time only)
2. **Press and hold** the orange microphone button at the bottom
3. **Speak in Hindi or English** (e.g., "Aaj bahut thak gaya", "Khana khaya?")
4. **Release** the button when done speaking
5. Wait a moment while:
   - Your voice is transcribed to text (Deepgram)
   - Saathi generates a response (Gemini)
   - Response is spoken in Hindi female voice (ElevenLabs)

### Testing Text Chat:

- Type a message in the text input at the bottom
- Click "भेजें" (Send)
- Saathi will reply in text AND voice

### Try These Conversations:

- "Namaste" → Saathi will greet you warmly
- "Aaj bahut thak gaya yaar" → Caring response about rest
- "Baarish ho rahi hai" → Safety reminder
- "Ek customer ne daant diya" → Empathetic support

The companion responds in natural Hindi with a warm, caring tone.
