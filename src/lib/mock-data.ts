import type { User, Subject, Concept, ConceptQuestion, Attempt, Evaluation } from '@/types';

export const users: User[] = [
  { id: 'S101', name: 'Alex Johnson', role: 'student', class: '10', section: 'A' },
  { id: 'T201', name: 'Dr. Evelyn Reed', role: 'teacher' },
  { id: 'A301', name: 'Principal Maxwell', role: 'admin' },
];

export const subjects: Subject[] = [
  { id: 'science', name: 'Science' },
  { id: 'math', name: 'Math' },
];

export const concepts: Concept[] = [
  // Science
  { id: 'c1', subjectId: 'science', name: 'Photosynthesis' },
  { id: 'c2', subjectId: 'science', name: 'Newton\'s Laws of Motion' },
  { id: 'c3', subjectId: 'science', name: 'Cellular Respiration' },
  // Math
  { id: 'c4', subjectId: 'math', name: 'Pythagorean Theorem' },
  { id: 'c5', subjectId: 'math', name: 'Quadratic Equations' },
  { id: 'c6', subjectId: 'math', name: 'Linear Functions' },
];

export const questions: ConceptQuestion[] = [
  // Photosynthesis
  { id: 'q1', conceptId: 'c1', questionText: 'Explain the process of photosynthesis in your own words.' },
  { id: 'q2', conceptId: 'c1', questionText: 'What are the main inputs and outputs of photosynthesis?' },
  // Pythagorean Theorem
  { id: 'q3', conceptId: 'c4', questionText: 'Describe what the Pythagorean Theorem is used for.' },
  { id: 'q4', conceptId: 'c4', questionText: 'Apply the theorem to a right triangle with legs of 3cm and 4cm.' },
];

// Student data store
export let attempts: Attempt[] = [
    { id: 'att1', studentId: 'S101', conceptId: 'c1', status: 'Feedback Available', evaluationId: 'eval1', answers: [] },
    { id: 'att2', studentId: 'S101', conceptId: 'c2', status: 'In Progress', answers: [] },
];

export let evaluations: Evaluation[] = [
    {
        id: 'eval1',
        attemptId: 'att1',
        understandingLevel: 'Partial',
        strengths: ['Correctly identified that photosynthesis involves plants making food.'],
        gaps: ['Did not mention key inputs like Carbon Dioxide or outputs like Oxygen.'],
        correctExplanation: 'Photosynthesis is the process plants use to convert light energy into chemical energy, creating food (glucose) from carbon dioxide and water, and releasing oxygen as a byproduct.',
        evaluatedAt: new Date(),
    }
];

// Helper function to get or create attempts for a student
export function getStudentAttempts(studentId: string): Attempt[] {
    const studentAttempts = attempts.filter(a => a.studentId === studentId);
    const conceptsWithAttempts = studentAttempts.map(a => a.conceptId);

    const missingAttempts: Attempt[] = concepts
        .filter(c => !conceptsWithAttempts.includes(c.id))
        .map(c => ({
            id: `att${c.id}${studentId}`,
            studentId,
            conceptId: c.id,
            status: 'Not Started',
            answers: [],
        }));

    return [...studentAttempts, ...missingAttempts];
}
