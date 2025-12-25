// Overall Role
export type Role = 'student' | 'teacher';

// Student Dashboard
export type ConceptStatus = 'Not Started' | 'In Progress' | 'Feedback Available';
export type UnderstandingLevel = 'Strong' | 'Partial' | 'Weak';

export interface Concept {
  id: string;
  name: string;
  status: ConceptStatus;
  questions?: string[]; // Used in concept attempt page
}

export interface Chapter {
  id: string;
  title: string;
  icon: string;
  concepts: Concept[];
}

// Teacher Dashboard - Concept Performance
export interface ConceptPerformance {
  id: string;
  name: string;
  understanding: {
    strong: number;
    partial: number;
    weak: number;
  };
}

// Teacher Dashboard - Student Roster
export interface Student {
    id: string;
    name: string;
    rollNumber: string;
}

// Data contract for Concept Overview page
export interface ConceptOverview {
  id: string;
  name: string;
  distribution: {
    strong: number;
    partial: number;
    weak: number;
  };
  keyGaps: string[];
  suggestedActions: string[];
  studentAttempts: StudentAttemptSummary[];
}

export interface StudentAttemptSummary {
  studentId: string;
  studentName: string;
  rollNumber: string;
  understanding: UnderstandingLevel;
  keyIssue: string;
}


// Data contract for Student Attempt / Feedback (shared between student and teacher)
export interface StudentAttempt {
  conceptName: string;
  questions: string[];
  studentAnswers: string[];
  feedback: {
    understandingLevel: UnderstandingLevel;
    strength: string;
    gap: string;
    languageFeedback?: {
      spelling?: string[];
      clarity?: string;
      pronunciation?: string[];
    };
    correctExplanation: string;
  };
}

// Data contract for Student Profile (teacher view)
export interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  snapshot: {
    strongConcepts: number;
    needsWork: number;
    repeatedIssue: string;
  };
  patterns: string[];
  focusActions: string[];
  recentConcepts: {
    id: string;
    name: string;
    status: UnderstandingLevel;
    date: string;
  }[];
}
