'use server';
/**
 * @fileOverview Saves a student's concept attempt and returns a dummy evaluation.
 *
 * - evaluateConcept - A function to handle the concept evaluation process.
 * - EvaluateConceptInput - The input type for the evaluateConcept function.
 * - EvaluateConceptOutput - The return type for the evaluateConcept function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const EvaluateConceptInputSchema = z.object({
  studentId: z.string(),
  conceptId: z.string(),
  questions: z.array(z.string()),
  answers: z.array(z.string()),
});
export type EvaluateConceptInput = z.infer<typeof EvaluateConceptInputSchema>;

export const EvaluateConceptOutputSchema = z.object({
    attemptId: z.string(),
    understanding: z.enum(['Strong', 'Partial', 'Weak']),
    strength: z.string(),
    gap: z.string(),
    language: z.object({
        spelling: z.array(z.string()).optional(),
        clarity: z.string().optional(),
        pronunciation: z.array(z.string()).optional(),
    }),
    correctExplanation: z.string(),
});
export type EvaluateConceptOutput = z.infer<typeof EvaluateConceptOutputSchema>;

export async function evaluateConcept(input: EvaluateConceptInput): Promise<EvaluateConceptOutput> {
    return evaluateConceptFlow(input);
}

const evaluateConceptFlow = ai.defineFlow(
  {
    name: 'evaluateConceptFlow',
    inputSchema: EvaluateConceptInputSchema,
    outputSchema: EvaluateConceptOutputSchema,
  },
  async (input) => {
    // In a real implementation, this would:
    // 1. Save the attempt to the 'attempts' collection in Firestore.
    // 2. Trigger an AI evaluation (or use a predefined one).
    // 3. Save the evaluation to the 'evaluations' collection.
    // 4. Return the evaluation.

    console.log('Received concept evaluation request:', input);

    // For now, return a static dummy evaluation.
    const dummyEvaluation: EvaluateConceptOutput = {
      attemptId: `A${Date.now()}`,
      understanding: 'Partial',
      strength: 'You correctly identified the role of sunlight.',
      gap: 'The steps of the food preparation process were incomplete or missing.',
      language: {
        spelling: ['photosynthesis'],
        clarity: 'Try using shorter, more direct sentences to explain the steps.',
      },
      correctExplanation: 'Photosynthesis is the process plants use to convert sunlight, water, and carbon dioxide into glucose (sugar) for energy, releasing oxygen as a byproduct.',
    };

    return dummyEvaluation;
  }
);
