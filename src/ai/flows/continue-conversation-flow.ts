'use server';
/**
 * @fileOverview A conversational flow that takes a student's answer, provides a spoken
 * acknowledgment, and asks a follow-up question using text-to-speech.
 *
 * - continueConversation - A function that continues the conversation.
 * - ContinueConversationInput - The input type for the continueConversation function.
 * - ContinueConversationOutput - The return type for the continueConversation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { ContinueConversationInputSchema, ContinueConversationOutputSchema } from '@/types';


export async function continueConversation(input: z.infer<typeof ContinueConversationInputSchema>): Promise<z.infer<typeof ContinueConversationOutputSchema>> {
    return continueConversationFlow(input);
}


const prompt = `You are a friendly and encouraging AI assistant for students.
Your goal is to have a short, natural conversation to understand what a student knows about a concept.
You will be given the concept and the student's first answer.

Your task is to:
1.  Provide a brief, one-sentence acknowledgment of their answer. (e.g., "Okay, I see.", "Got it, thanks for sharing that.")
2.  Immediately ask a relevant follow-up question to probe their understanding further. This should be the second of two questions total, so end your response after this question.

Example:
Concept: Photosynthesis
Student's First Answer: "It's how plants eat."
Your response: "Thanks for explaining that. Can you tell me what plants need to make their food?"

---
Concept: {{{conceptName}}}
Student's First Answer: {{{firstAnswer}}}
---

Your spoken response (acknowledgment + one follow-up question):`;

const continueConversationFlow = ai.defineFlow(
  {
    name: 'continueConversationFlow',
    inputSchema: ContinueConversationInputSchema,
    outputSchema: ContinueConversationOutputSchema,
  },
  async (input) => {
    
    const llmResponse = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-2.5-flash',
        input: input,
    });

    const responseText = llmResponse.text;

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
        prompt: responseText,
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
      aiResponseText: responseText,
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
