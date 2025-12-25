import type { LucideIcon } from "lucide-react";

export type UserRole = 'student' | 'teacher' | 'admin';

export type User = {
  id: string;
  name: string;
  role: UserRole;
  class?: string;
  section?: string;
};

export type Subject = {
  id: string;
  name: string;
};

export type Concept = {
  id: string;
  name: string;
  subjectId: string;
};

export type ConceptQuestion = {
  id: string;
  conceptId: string;
  questionText: string;
};

export type Attempt = {
    id: string;
    studentId: string;
    conceptId: string;
    answers: { questionId: string; answerText: string }[];
    evaluationId?: string;
    status: 'Not Started' | 'In Progress' | 'Feedback Available';
};

export type Evaluation = {
    id: string;
    attemptId: string;
    understandingLevel: 'Strong' | 'Partial' | 'Weak';
    strengths: string[];
    gaps: string[];
    correctExplanation: string;
    evaluatedAt: Date;
};
