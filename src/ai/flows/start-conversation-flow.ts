'use server';
/**
 * @fileOverview A conversational flow that starts a concept evaluation with a student
 * by asking the first question using text-to-speech.
 *
 * - startConversation - A function that starts the conversation.
 * - StartConversationInput - The input type for the startConversation function.
 * - StartConversationOutput - The return type for the startConversation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { StartConversationInputSchema, StartConversationOutputSchema } from '@/types';


export async function startConversation(input: z.infer<typeof StartConversationInputSchema>): Promise<z.infer<typeof StartConversationOutputSchema>> {
    return startConversationFlow(input);
}

const prompt = `You are a friendly and encouraging AI assistant for students.
Your goal is to have a short, natural conversation to understand what a student knows about a concept.
You will be given the concept name. Your task is to generate ONLY the first, open-ended question to kick off the conversation.

Example:
Concept: Photosynthesis
Your question: "Can you start by explaining photosynthesis in your own words?"

---
Concept: {{{conceptName}}}
---

Your first spoken question:`;


const startConversationFlow = ai.defineFlow(
  {
    name: 'startConversationFlow',
    inputSchema: StartConversationInputSchema,
    outputSchema: StartConversationOutputSchema,
  },
  async (input) => {
    
    const llmResponse = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-2.5-flash',
    }, input);

    const questionText = llmResponse.text;

    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Algenib' },
                },
            },
        },
        prompt: questionText,
    });
    
    if (!media) {
      throw new Error('No audio media was generated.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavAudio = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavAudio,
      questionText: questionText,
    };
  }
);

// Helper function to convert PCM audio data to WAV format.
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
