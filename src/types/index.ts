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
  icon: LucideIcon;
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

export type StudentResponse = {
  id: string;
  studentId: string;
  conceptId: string;
  answers: { questionId: string; answerText: string }[];
  feedback?: Feedback;
  submittedAt: Date;
};

export type Feedback = {
  correctPoints: string;
  incorrectPoints: string;
  correctlyFramedExplanation: string;
};

export type ConceptUnderstanding = 'Strong' | 'Partial' | 'Weak';

export type TeacherConceptStats = {
  conceptId: string;
  understanding: {
    strong: number; // percentage
    partial: number;
    weak: number;
  };
  commonMisconceptions: string[];
};

export type AdminConceptDifficulty = {
  className: string;
  conceptName: string;
  difficulty: number; // 0-100
};

export type AdminTrend = {
  date: string; // e.g., 'Jan', 'Feb'
  "Average Understanding": number; // 0-100
};
