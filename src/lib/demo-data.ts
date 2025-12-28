'use client';

import type { DemoStudent, DemoConcept, DemoEvaluation } from '@/types';

const defaultStudents: DemoStudent[] = [
  { "studentId": "S001", "name": "Aarav", "class": "5A" },
  { "studentId": "S002", "name": "Riya", "class": "5A" },
  { "studentId": "S003", "name": "Kabir", "class": "5A" },
  { "studentId": "S004", "name": "Ananya", "class": "5A" },
  { "studentId": "S005", "name": "Vivaan", "class": "5A" },
  { "studentId": "S006", "name": "Diya", "class": "5A" },
  { "studentId": "S007", "name": "Arjun", "class": "5A" },
  { "studentId": "S008", "name": "Saanvi", "class": "5A" },
  { "studentId": "S009", "name": "Ishaan", "class": "5A" },
  { "studentId": "S010", "name": "Myra", "class": "5A" },
  { "studentId": "S011", "name": "Ayaan", "class": "5A" },
  { "studentId": "S012", "name": "Avani", "class": "5A" },
  { "studentId": "S013", "name": "Reyansh", "class": "5A" },
  { "studentId": "S014", "name": "Anika", "class": "5A" },
  { "studentId": "S015", "name": "Advik", "class": "5A" },
];

const defaultConcepts: DemoConcept[] = [
  {
    "conceptId": "photosynthesis",
    "subject": "Science",
    "chapter": "Plants",
    "grade": 5
  },
  {
    "conceptId": "evaporation",
    "subject": "Science",
    "chapter": "Water",
    "grade": 5
  },
  {
    "conceptId": "respiration",
    "subject": "Science",
    "chapter": "Animals & Human Body",
    "grade": 5
  },
  {
    "conceptId": "light-reflection",
    "subject": "Science",
    "chapter": "Energy, Light & Sound",
    "grade": 5
  },
];

const defaultEvaluations: DemoEvaluation[] = [
  {
    "sessionId": "E001",
    "studentId": "S001",
    "conceptId": "photosynthesis",
    "date": "2025-01-12",
    "evaluation": {
      "understanding": "Partial",
      "strength": "Understood role of sunlight",
      "gap": "Did not explain use of water and air",
      "language": {
        "clarity": "Average",
        "confidence": "Medium"
      }
    }
  },
  {
    "sessionId": "E002",
    "studentId": "S002",
    "conceptId": "photosynthesis",
    "date": "2025-01-12",
    "evaluation": {
      "understanding": "Weak",
      "strength": "None",
      "gap": "Confused food preparation with soil absorption",
      "language": {
        "clarity": "Low",
        "confidence": "Low"
      }
    }
  },
   {
    "sessionId": "E003",
    "studentId": "S003",
    "conceptId": "photosynthesis",
    "date": "2025-01-13",
    "evaluation": {
      "understanding": "Strong",
      "strength": "Clearly explained the roles of sunlight, water, and CO2.",
      "gap": "None",
      "language": {
        "clarity": "High",
        "confidence": "High"
      }
    }
  },
  {
    "sessionId": "E004",
    "studentId": "S001",
    "conceptId": "evaporation",
    "date": "2025-01-14",
    "evaluation": {
      "understanding": "Strong",
      "strength": "Correctly identified that heat causes water to turn into vapor.",
      "gap": "None",
      "language": {
        "clarity": "High",
        "confidence": "Medium"
      }
    }
  }
];

// Function to initialize localStorage with default data if it's not already there
export function initializeDemoData() {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem('students')) {
      localStorage.setItem('students', JSON.stringify(defaultStudents));
    }
    if (!localStorage.getItem('concepts')) {
      localStorage.setItem('concepts', JSON.stringify(defaultConcepts));
    }
    if (!localStorage.getItem('evaluations')) {
      localStorage.setItem('evaluations', JSON.stringify(defaultEvaluations));
    }
  }
}

// Functions to get data from localStorage
export function getStudents(): DemoStudent[] {
  if (typeof window !== 'undefined') {
    const students = localStorage.getItem('students');
    return students ? JSON.parse(students) : [];
  }
  return [];
}

export function getConcepts(): DemoConcept[] {
  if (typeof window !== 'undefined') {
    const concepts = localStorage.getItem('concepts');
    return concepts ? JSON.parse(concepts) : [];
  }
  return [];
}

export function getEvaluations(): DemoEvaluation[] {
  if (typeof window !== 'undefined') {
    const evaluations = localStorage.getItem('evaluations');
    return evaluations ? JSON.parse(evaluations) : [];
  }
  return [];
}

// Function to add a new evaluation
export function addEvaluation(evaluation: DemoEvaluation) {
  if (typeof window !== 'undefined') {
    const evaluations = getEvaluations();
    evaluations.push(evaluation);
    localStorage.setItem('evaluations', JSON.stringify(evaluations));
  }
}
