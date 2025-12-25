'use server';
/**
 * @fileOverview Fetches aggregated data for the teacher's concept overview page.
 *
 * - getConceptOverview - A function to fetch the concept overview.
 * - GetConceptOverviewInput - The input type for the getConceptOverview function.
 * - GetConceptOverviewOutput - The return type for the getConceptOverview function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GetConceptOverviewInputSchema = z.object({
  conceptId: z.string(),
  class: z.string(),
});
export type GetConceptOverviewInput = z.infer<typeof GetConceptOverviewInputSchema>;

export const GetConceptOverviewOutputSchema = z.object({
    id: z.string(),
    name: z.string(),
    distribution: z.object({
        strong: z.number(),
        partial: z.number(),
        weak: z.number(),
    }),
    keyGaps: z.array(z.string()),
    suggestedActions: z.array(z.string()),
    studentAttempts: z.array(z.object({
        studentId: z.string(),
        studentName: z.string(),
        rollNumber: z.string(),
        understanding: z.enum(['Strong', 'Partial', 'Weak']),
        keyIssue: z.string(),
    })),
});
export type GetConceptOverviewOutput = z.infer<typeof GetConceptOverviewOutputSchema>;

export async function getConceptOverview(input: GetConceptOverviewInput): Promise<GetConceptOverviewOutput> {
  return getConceptOverviewFlow(input);
}

const getConceptOverviewFlow = ai.defineFlow(
  {
    name: 'getConceptOverviewFlow',
    inputSchema: GetConceptOverviewInputSchema,
    outputSchema: GetConceptOverviewOutputSchema,
  },
  async ({ conceptId, class: className }) => {
    // In a real implementation, this would:
    // 1. Query 'attempts' and 'evaluations' for the given conceptId and class.
    // 2. Aggregate the data to calculate distribution, common gaps, etc.
    // 3. Return the aggregated overview.

    console.log(`Fetching concept overview for concept: ${conceptId}, class: ${className}`);

    const dummyConceptData = {
        id: 'photosynthesis',
        name: 'Photosynthesis',
        distribution: { strong: 5, partial: 12, weak: 3 },
        keyGaps: [
            'Missed steps of food preparation process.',
            'Confused the roles of sunlight and heat.',
            'Difficulty explaining the concept in their own words.',
        ],
        suggestedActions: [
            'Re-explain the process using a visual diagram on the board.',
            'Ask students to explain the concept aloud to a partner.',
            'Use the real-life example of a houseplant needing sunlight.',
        ],
        studentAttempts: [
            { studentId: '1', studentName: 'Anonymized Student 1', rollNumber: 'S101', understanding: 'Partial' as const, keyIssue: 'Incomplete food steps' },
            { studentId: '2', studentName: 'Anonymized Student 2', rollNumber: 'S102', understanding: 'Strong' as const, keyIssue: 'None' },
            { studentId: '3', studentName: 'Anonymized Student 3', rollNumber: 'S103', understanding: 'Weak' as const, keyIssue: 'Role of CO2 missing' },
            { studentId: '4', studentName: 'Anonymized Student 4', rollNumber: 'S104', understanding: 'Partial' as const, keyIssue: 'Confused sunlight/heat' },
        ]
    };

    return dummyConceptData;
  }
);
