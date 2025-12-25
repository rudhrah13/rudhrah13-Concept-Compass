'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { attempts, concepts, questions as allQuestions, evaluations } from '@/lib/mock-data';
import type { Attempt, Evaluation } from '@/types';

// This is the mock implementation for POST /evaluateConcept
async function evaluateConcept(
  _concept: any, 
  _combinedAnswers: string
): Promise<Omit<Evaluation, 'id' | 'attemptId' | 'evaluatedAt'>> {
  // In a real implementation, this would call the AI backend.
  // For now, we return mock data.
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  
  return {
    understandingLevel: "Partial",
    strengths: ["You correctly identified the basic idea."],
    gaps: ["Your application of the concept was unclear and could use more detail.", "You missed mentioning a key component."],
    correctExplanation: "A clear, simple explanation of the concept written in easy language would go here, explaining all the core ideas correctly."
  };
}

export async function submitResponse(formData: FormData) {
  // In a real app, user would be from session.
  const studentId = 'S101'; 
  const conceptId = formData.get('conceptId') as string;
  const concept = concepts.find(c => c.id === conceptId);
  const conceptQuestions = allQuestions.filter(q => q.conceptId === conceptId);

  if (!concept) {
    throw new Error('Concept not found');
  }

  // --- Find and update the attempt ---
  let attempt = attempts.find(a => a.studentId === studentId && a.conceptId === conceptId);
  if (!attempt) {
    throw new Error('Attempt not found');
  }
  
  const answers: { questionId: string, answerText: string }[] = [];
  let combinedAnswers = '';
  
  conceptQuestions.forEach((question, index) => {
    const questionId = formData.get(`questionId_${index}`) as string;
    const answerText = formData.get(`answer_${index}`) as string;
    if (questionId && answerText) {
      answers.push({ questionId, answerText });
      combinedAnswers += `Answer to "${question.questionText}": ${answerText}\n`;
    }
  });

  if (answers.length === 0) {
    throw new Error('No answers submitted');
  }

  // Update attempt with answers and set status to In Progress
  attempt.answers = answers;
  attempt.status = 'In Progress';
  revalidatePath('/student/dashboard');

  // --- Call the (mocked) evaluation service ---
  const mockEvaluationResult = await evaluateConcept(concept, combinedAnswers);
  
  // --- Create the new evaluation record ---
  const newEvaluation: Evaluation = {
    id: `eval${Date.now()}`,
    attemptId: attempt.id,
    ...mockEvaluationResult,
    evaluatedAt: new Date(),
  };
  evaluations.push(newEvaluation);

  // --- Link evaluation to attempt and update status ---
  attempt.evaluationId = newEvaluation.id;
  attempt.status = 'Feedback Available';

  revalidatePath('/student/dashboard');
  revalidatePath(`/student/concept/${conceptId}`);

  redirect(`/student/feedback/${newEvaluation.id}`);
}
