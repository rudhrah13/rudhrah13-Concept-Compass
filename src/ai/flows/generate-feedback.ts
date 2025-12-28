'use server';
/**
 * @fileOverview An AI agent that provides feedback on student answers to concept questions.
 *
 * - generateFeedback - A function that generates feedback for a student's answer.
 * - GenerateFeedbackInput - The input type for the generateFeedback function.
 * - GenerateFeedbackOutput - The return type for the generateFeedback function.
 */

import {ai} from '@/ai/genkit';
import { GenerateFeedbackInputSchema, GenerateFeedbackOutputSchema, type GenerateFeedbackInput, type GenerateFeedbackOutput } from '@/types';


export async function generateFeedback(input: GenerateFeedbackInput): Promise<GenerateFeedbackOutput> {
  return generateFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFeedbackPrompt',
  input: {schema: GenerateFeedbackInputSchema},
  output: {schema: GenerateFeedbackOutputSchema},
  prompt: `You are an AI assistant that provides feedback to students on their answers to concept questions.

You will receive the concept, the question, and the student's answer. You will then provide feedback to the student in the form of:

- What the student got correct
- What the student got incorrect or unclear
- A correctly framed explanation of the concept

Concept: {{{concept}}}
Question: {{{question}}}
Student Answer: {{{studentAnswer}}}`,
});

const generateFeedbackFlow = ai.defineFlow(
  {
    name: 'generateFeedbackFlow',
    inputSchema: GenerateFeedbackInputSchema,
    outputSchema: GenerateFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
