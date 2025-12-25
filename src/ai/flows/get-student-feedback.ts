'use server';
/**
 * @fileOverview Fetches the data needed for the student feedback page.
 *
 * - getStudentFeedback - Fetches questions, answers, and evaluation data.
 * - GetStudentFeedbackInput - The input type for the getStudentFeedback function.
 * - GetStudentFeedbackOutput - The return type for the getStudentFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { StudentAttempt } from '@/types';


export const GetStudentFeedbackInputSchema = z.object({
  attemptId: z.string(),
});
export type GetStudentFeedbackInput = z.infer<typeof GetStudentFeedbackInputSchema>;

// The output schema should match the StudentAttempt type from src/types/index.ts
export const GetStudentFeedbackOutputSchema = z.object({
  conceptName: z.string(),
  questions: z.array(z.string()),
  studentAnswers: z.array(z.string()),
  feedback: z.object({
    understandingLevel: z.enum(['Strong', 'Partial', 'Weak']),
    strength: z.string(),
    gap: z.string(),
    languageFeedback: z.object({
      spelling: z.array(z.string()).optional(),
      clarity: z.string().optional(),
      pronunciation: z.array(z.string()).optional(),
    }).optional(),
    correctExplanation: z.string(),
  }),
});

export type GetStudentFeedbackOutput = z.infer<typeof GetStudentFeedbackOutputSchema>;


export async function getStudentFeedback(input: GetStudentFeedbackInput): Promise<GetStudentFeedbackOutput> {
  return getStudentFeedbackFlow(input);
}

const getStudentFeedbackFlow = ai.defineFlow(
  {
    name: 'getStudentFeedbackFlow',
    inputSchema: GetStudentFeedbackInputSchema,
    outputSchema: GetStudentFeedbackOutputSchema,
  },
  async ({ attemptId }) => {
    // In a real implementation, this would:
    // 1. Fetch the attempt from the 'attempts' collection using the attemptId.
    // 2. Fetch the corresponding evaluation from the 'evaluations' collection.
    // 3. Fetch the concept details from the 'concepts' collection.
    // 4. Combine them into the StudentAttempt structure.

    console.log('Fetching student feedback for attemptId:', attemptId);

    const mockAttemptData: StudentAttempt = {
      conceptName: 'Photosynthesis',
      questions: [
        'Explain photosynthesis in your own words.',
        'What happens if sunlight is not available?',
      ],
      studentAnswers: [
        'Photosynthesis is when plants make their own food. They use sunlight and water. It is green.',
        'If there is no sun, the plant will die because it cannot make food.',
      ],
      feedback: {
        understandingLevel: 'Partial',
        strength: 'You correctly identified that plants use sunlight to make food.',
        gap: 'The role of carbon dioxide was missing, and the explanation of the food-making process could be more detailed.',
        languageFeedback: {
          spelling: ['photosynthesis'],
          clarity: 'Try using shorter sentences to explain the steps.',
        },
        correctExplanation:
          'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide from the air to create their own food (sugar/glucose) for energy, releasing oxygen as a byproduct.',
      },
    };

    return mockAttemptData;
  }
);
