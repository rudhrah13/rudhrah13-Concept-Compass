'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/lib/auth/actions';
import { generateFeedback } from '@/ai/flows/generate-feedback';
import { concepts, questions as allQuestions, studentResponses } from '@/lib/mock-data';
import type { StudentResponse, ConceptQuestion } from '@/types';

export async function submitResponse(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'student') {
    throw new Error('Authentication required');
  }

  const conceptId = formData.get('conceptId') as string;
  const concept = concepts.find(c => c.id === conceptId);
  const conceptQuestions = allQuestions.filter(q => q.conceptId === conceptId);

  if (!concept) {
    throw new Error('Concept not found');
  }

  const answers: { questionId: string, answerText: string }[] = [];
  let combinedQuestions = '';
  let combinedAnswers = '';
  
  conceptQuestions.forEach((question, index) => {
    const questionId = formData.get(`questionId_${index}`) as string;
    const answerText = formData.get(`answer_${index}`) as string;
    if (questionId && answerText) {
      answers.push({ questionId, answerText });
      combinedQuestions += `Question: ${question.questionText}\n`;
      combinedAnswers += `Answer: ${answerText}\n`;
    }
  });

  if (answers.length === 0) {
    throw new Error('No answers submitted');
  }

  // For prototype simplicity, we combine questions and answers for one AI call.
  const feedback = await generateFeedback({
    concept: concept.name,
    question: combinedQuestions.trim(),
    studentAnswer: combinedAnswers.trim(),
  });

  const newResponse: StudentResponse = {
    id: `resp${Date.now()}`,
    studentId: user.id,
    conceptId,
    answers,
    feedback,
    submittedAt: new Date(),
  };

  // Mock saving the response
  studentResponses.push(newResponse);

  revalidatePath('/teacher/dashboard');
  revalidatePath(`/teacher/concept/${conceptId}`);

  redirect(`/student/feedback/${newResponse.id}`);
}
