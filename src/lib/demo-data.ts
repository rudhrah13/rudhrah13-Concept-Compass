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
    "conceptName": "Photosynthesis",
    "subject": "Science",
    "chapter": "Plants",
    "grade": 5
  },
  {
    "conceptId": "parts-of-plant",
    "conceptName": "Parts of a Plant",
    "subject": "Science",
    "chapter": "Plants",
    "grade": 5
  },
  {
    "conceptId": "functions-of-roots",
    "conceptName": "Functions of Roots",
    "subject": "Science",
    "chapter": "Plants",
    "grade": 5
  },
  {
    "conceptId": "evaporation",
    "conceptName": "Evaporation",
    "subject": "Science",
    "chapter": "Water",
    "grade": 5
  },
  {
    "conceptId": "condensation",
    "conceptName": "Condensation",
    "subject": "Science",
    "chapter": "Water",
    "grade": 5
  },
  {
    "conceptId": "water-cycle",
    "conceptName": "Water Cycle",
    "subject": "Science",
    "chapter": "Water",
    "grade": 5
  },
  {
    "conceptId": "respiration",
    "conceptName": "Respiration",
    "subject": "Science",
    "chapter": "Animals & Human Body",
    "grade": 5
  },
  {
    "conceptId": "light-reflection",
    "conceptName": "Light Reflection",
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
    "conversation": {
      "questionsAsked": [
        {
          "questionType": "explain",
          "questionText": "Can you tell me how a plant makes its food?"
        },
        {
          "questionType": "probe",
          "questionText": "Apart from sunlight, what else does a plant need?"
        }
      ],
      "studentResponses": [
        "Plants make food using sunlight in their leaves.",
        "I think only sunlight is needed."
      ]
    },
    "evaluation": {
      "understanding": "Partial",
      "strength": "Student correctly identified sunlight as essential for food preparation.",
      "gap": "Student did not mention the use of water and air in making food.",
      "language": {
        "clarity": "Average",
        "confidence": "Medium"
      }
    },
    "correctExplanation": "Plants prepare their own food in the leaves using sunlight, water, and carbon dioxide. Soil does not give food, it only provides water and minerals. This process is called photosynthesis."
  },
  {
    "sessionId": "E002",
    "studentId": "S002",
    "conceptId": "photosynthesis",
    "date": "2025-01-12",
     "conversation": {
      "questionsAsked": [
        {
          "questionType": "explain",
          "questionText": "Can you explain how plants get their food?"
        },
        {
          "questionType": "misconception",
          "questionText": "Interesting. So do plants 'eat' the soil?"
        }
      ],
      "studentResponses": [
        "Plants get their food from the soil. They have roots that eat the soil.",
        "Yes, the roots are like a mouth for the plant."
      ]
    },
    "evaluation": {
      "understanding": "Weak",
      "strength": "Student understands that roots are important for the plant.",
      "gap": "Student has a misconception that plants 'eat' soil for food, rather than absorbing water and nutrients from it.",
      "language": {
        "clarity": "Low",
        "confidence": "Low"
      }
    },
    "correctExplanation": "Plants prepare their own food in the leaves using sunlight, water, and carbon dioxide. Soil does not give food, it only provides water and minerals. This process is called photosynthesis."
  },
   {
    "sessionId": "E003",
    "studentId": "S003",
    "conceptId": "photosynthesis",
    "date": "2025-01-13",
     "conversation": {
      "questionsAsked": [
        {
          "questionType": "explain",
          "questionText": "Can you tell me how a plant makes its food?"
        },
        {
          "questionType": "follow-up",
          "questionText": "That's great. What is the name of the gas plants take from the air?"
        }
      ],
      "studentResponses": [
        "Plants make food in their leaves. They need sunlight, water from the roots, and air.",
        "They take in carbon dioxide and release oxygen."
      ]
    },
    "evaluation": {
      "understanding": "Strong",
      "strength": "Clearly explained the roles of sunlight, water, and CO2, and mentioned the byproduct oxygen.",
      "gap": "None",
      "language": {
        "clarity": "High",
        "confidence": "High"
      }
    },
    "correctExplanation": "Plants prepare their own food in the leaves using sunlight, water, and carbon dioxide. Soil does not give food, it only provides water and minerals. This process is called photosynthesis."
  },
  {
    "sessionId": "E004",
    "studentId": "S001",
    "conceptId": "evaporation",
    "date": "2025-01-14",
    "conversation": {
      "questionsAsked": [
        {
          "questionType": "explain",
          "questionText": "What happens to water in a puddle on a hot, sunny day?"
        },
        {
          "questionType": "probe",
          "questionText": "Where does the water go? Does it just disappear?"
        }
      ],
      "studentResponses": [
        "The water in the puddle dries up.",
        "It goes into the air. But I don't know what it is called."
      ]
    },
    "evaluation": {
      "understanding": "Partial",
      "strength": "Student correctly observed that water 'dries up' and 'goes into the air' due to heat.",
      "gap": "Could not name or fully define the process of evaporation.",
      "language": {
        "clarity": "High",
        "confidence": "Medium"
      }
    },
    "correctExplanation": "Evaporation is the process where a liquid, like water, turns into a gas or vapor. On a hot day, the sun's energy causes water molecules to move faster and escape into the air as water vapor."
  },
  {
    "sessionId": "E005",
    "studentId": "S004",
    "conceptId": "parts-of-plant",
    "date": "2025-01-15",
    "conversation": {
      "questionsAsked": [
        {
          "questionType": "explain",
          "questionText": "Can you name the main parts of a plant?"
        },
        {
          "questionType": "probe",
          "questionText": "What about the part that makes food? What is it called?"
        }
      ],
      "studentResponses": [
        "A plant has roots, a stem, and flowers.",
        "Oh, yes, and leaves. The leaves make the food."
      ]
    },
    "evaluation": {
      "understanding": "Strong",
      "strength": "Student correctly identified all major parts of a plant.",
      "gap": "Initially missed 'leaves' but self-corrected upon prompting.",
      "language": {
        "clarity": "High",
        "confidence": "High"
      }
    },
    "correctExplanation": "The main parts of a plant are the roots, which anchor the plant and absorb water; the stem, which supports the plant; the leaves, which perform photosynthesis; and the flowers, which are involved in reproduction."
  }
];

// Function to initialize localStorage with default data if it's not already there
export function initializeDemoData() {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem('students')) {
      localStorage.setItem('students', JSON.stringify(defaultStudents));
    }
    // Always overwrite concepts and evaluations to ensure the latest data structure
    localStorage.setItem('concepts', JSON.stringify(defaultConcepts));
    localStorage.setItem('evaluations', JSON.stringify(defaultEvaluations));
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
