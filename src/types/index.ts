import { z } from 'zod';

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
  chapter: string;
  understanding: {
    strong: number;
    partial: number;
    weak: number;
  };
}

// Teacher Dashboard - Student Roster
export interface Student {
    id:string;
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

// LocalStorage Demo Schemas
export interface DemoStudent {
  studentId: string;
  name: string;
  class: string;
}

export interface DemoConcept {
  conceptId: string;
  conceptName: string;
  subject: string;
  chapter: string;
  grade: number;
}

export interface DemoEvaluation {
  sessionId: string;
  studentId: string;
  conceptId: string;
  date: string;
  conversation: {
    questionsAsked: {
      questionType: string;
      questionText: string;
    }[];
    studentResponses: string[];
  },
  evaluation: {
    understanding: UnderstandingLevel;
    strength: string;
    gap: string;
    language: {
      clarity: string;
      confidence: string;
    }
  },
  correctExplanation: string;
}


// Zod Schemas for Genkit Flows

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


export const GetStudentFeedbackInputSchema = z.object({
  attemptId: z.string(),
});
export type GetStudentFeedbackInput = z.infer<typeof GetStudentFeedbackInputSchema>;

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


export const GetStudentProfileInputSchema = z.object({
  studentId: z.string(),
});
export type GetStudentProfileInput = z.infer<typeof GetStudentProfileInputSchema>;

export const GetStudentProfileOutputSchema = z.object({
    id: z.string(),
    name: z.string(),
    rollNumber: z.string(),
    snapshot: z.object({
        strongConcepts: z.number(),
        needsWork: z.number(),
        repeatedIssue: z.string(),
    }),
    patterns: z.array(z.string()),
    focusActions: z.array(z.string()),
    recentConcepts: z.array(z.object({
        id: z.string(),
        name: z.string(),
        status: z.enum(['Strong', 'Partial', 'Weak']),
        date: z.string(),
    })),
});
export type GetStudentProfileOutput = z.infer<typeof GetStudentProfileOutputSchema>;


export const GenerateFeedbackInputSchema = z.object({
  concept: z.string().describe('The concept the student is being questioned on.'),
  question: z.string().describe('The question the student is answering.'),
  studentAnswer: z.string().describe('The student answer to the question.'),
});
export type GenerateFeedbackInput = z.infer<typeof GenerateFeedbackInputSchema>;

export const GenerateFeedbackOutputSchema = z.object({
  correctPoints: z.string().describe('What the student got correct.'),
  incorrectPoints: z.string().describe('What the student got incorrect or unclear.'),
  correctlyFramedExplanation: z
    .string()
    .describe('A correctly framed explanation of the concept.'),
});
export type GenerateFeedbackOutput = z.infer<typeof GenerateFeedbackOutputSchema>;

export const StartConversationInputSchema = z.object({
  conceptName: z.string(),
});
export type StartConversationInput = z.infer<typeof StartConversationInputSchema>;

export const StartConversationOutputSchema = z.object({
  audioDataUri: z.string(),
  questionText: z.string(),
});
export type StartConversationOutput = z.infer<typeof StartConversationOutputSchema>;

export const ContinueConversationInputSchema = z.object({
  conceptName: z.string(),
  firstAnswer: z.string(),
});
export type ContinueConversationInput = z.infer<typeof ContinueConversationInputSchema>;

export const ContinueConversationOutputSchema = z.object({
  audioDataUri: z.string(),
  aiResponseText: z.string(),
});
export type ContinueConversationOutput = z.infer<typeof ContinueConversationOutputSchema>;
