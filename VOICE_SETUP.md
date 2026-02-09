# Getting Hindi Voice ID from ElevenLabs

The app needs a Hindi female voice ID from ElevenLabs. Here's how to get it:

## Option 1: Use Pre-made Hindi Voices (Recommended)

1. Log in to [ElevenLabs](https://elevenlabs.io)
2. Go to **Voice Library** in the left sidebar
3. Search for **Hindi** voices
4. Listen to these recommended voices:
   - **Rhea** - Warm, intimate (good for caring companion)
   - **Gargi** - Girl next door (friendly, casual)
   - **Riya** - Professional yet warm
5. Click on the voice you like
6. Click **"Add to My Voices"** or **"Use Voice"**
7. Copy the **Voice ID** (looks like: `pMsXgVXv3BLzUgSXRplE`)
8. Add to `.env.local`:
   ```
   ELEVENLABS_VOICE_ID=your_voice_id_here
   ```

## Option 2: Clone Your Own Voice (Advanced)

If you want a specific person's voice:

1. Go to **Voice Lab** → **Instant Voice Cloning**
2. Upload 1-2 minutes of clear Hindi audio
3. Name the voice (e.g., "Saathi")
4. Click **Add Voice**
5. Copy the Voice ID from the voice settings
6. Add to `.env.local`

## Option 3: Use API to List Available Voices

Run this in your terminal to see all available voices:

```bash
curl -X GET "https://api.elevenlabs.io/v1/voices" \
  -H "xi-api-key: sk_5335f1e4d61c3e823b0f8762741cdfb87b8c635a0eafdd27"
```

Look for Hindi voices in the response and copy the `voice_id`.

## Current Default

The app currently uses voice ID: `pMsXgVXv3BLzUgSXRplE` (Rachel - English voice)

**You should replace this with a Hindi voice for the best experience.**

## Testing the Voice

After updating the voice ID:
1. Restart the dev server (`npm run dev`)
2. Send a message to Saathi
3. Listen to the response - it should be in natural Hindi

If the voice sounds wrong, try a different voice ID from the Voice Library.
