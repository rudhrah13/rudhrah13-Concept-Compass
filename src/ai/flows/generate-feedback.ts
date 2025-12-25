'use server';
/**
 * @fileOverview An AI agent that provides feedback on student answers to concept questions.
 *
 * - generateFeedback - A function that generates feedback for a student's answer.
 * - GenerateFeedbackInput - The input type for the generateFeedback function.
 * - GenerateFeedbackOutput - The return type for the generateFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFeedbackInputSchema = z.object({
  concept: z.string().describe('The concept the student is being questioned on.'),
  question: z.string().describe('The question the student is answering.'),
  studentAnswer: z.string().describe('The student answer to the question.'),
});
export type GenerateFeedbackInput = z.infer<typeof GenerateFeedbackInputSchema>;

const GenerateFeedbackOutputSchema = z.object({
  correctPoints: z.string().describe('What the student got correct.'),
  incorrectPoints: z.string().describe('What the student got incorrect or unclear.'),
  correctlyFramedExplanation: z
    .string()
    .describe('A correctly framed explanation of the concept.'),
});
export type GenerateFeedbackOutput = z.infer<typeof GenerateFeedbackOutputSchema>;

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
