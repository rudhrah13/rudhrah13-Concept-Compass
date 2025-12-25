import type { User, Subject, Concept, ConceptQuestion, StudentResponse, Feedback, TeacherConceptStats, AdminConceptDifficulty, AdminTrend } from '@/types';
import { BookOpen, Calculator, FlaskConical, Landmark } from 'lucide-react';

export const users: User[] = [
  { id: 'S101', name: 'Alex Johnson', role: 'student', class: '10', section: 'A' },
  { id: 'S102', name: 'Benny Smith', role: 'student', class: '10', section: 'A' },
  { id: 'S103', name: 'Casey Lee', role: 'student', class: '10', section: 'B' },
  { id: 'T201', name: 'Dr. Evelyn Reed', role: 'teacher' },
  { id: 'A301', name: 'Principal Maxwell', role: 'admin' },
];

export const subjects: Subject[] = [
  { id: 'math', name: 'Mathematics', icon: Calculator },
  { id: 'science', name: 'Science', icon: FlaskConical },
  { id: 'history', name: 'History', icon: Landmark },
  { id: 'literature', name: 'Literature', icon: BookOpen },
];

export const concepts: Concept[] = [
  // Math
  { id: 'c1', subjectId: 'math', name: 'Pythagorean Theorem' },
  { id: 'c2', subjectId: 'math', name: 'Quadratic Equations' },
  // Science
  { id: 'c3', subjectId: 'science', name: 'Photosynthesis' },
  { id: 'c4', subjectId: 'science', name: 'Newton\'s Laws of Motion' },
  // History
  { id: 'c5', subjectId: 'history', name: 'The Renaissance' },
  { id: 'c6', subjectId: 'history', name: 'The Industrial Revolution' },
   // Literature
  { id: 'c7', subjectId: 'literature', name: 'Metaphor and Simile' },
  { id: 'c8', subjectId: 'literature', name: 'Character Arc' },
];

export const questions: ConceptQuestion[] = [
  { id: 'q1', conceptId: 'c1', questionText: 'In your own words, explain the Pythagorean Theorem.' },
  { id: 'q2', conceptId: 'c1', questionText: 'If a right-angled triangle has two shorter sides of length 3cm and 4cm, how would you use the theorem to find the length of the longest side (hypotenuse)?' },
  { id: 'q3', conceptId: 'c3', questionText: 'Describe the process of photosynthesis in your own words.' },
  { id: 'q4', conceptId: 'c3', questionText: 'Why is sunlight essential for photosynthesis? What would happen to a plant if it was kept in a dark room for a long time?' },
];

export const studentResponses: StudentResponse[] = [
  {
    id: 'resp1',
    studentId: 'S102',
    conceptId: 'c3',
    answers: [
      { questionId: 'q3', answerText: 'Plants make their food using light.' },
      { questionId: 'q4', answerText: 'Sunlight gives them energy. It will die in the dark.' }
    ],
    feedback: {
      correctPoints: 'You correctly identified that plants use light to make food and that sunlight provides energy.',
      incorrectPoints: 'Your explanation is a bit too simple. It doesn\'t mention the key ingredients like water, carbon dioxide, or the product, which is glucose (sugar). You also didn\'t mention chlorophyll.',
      correctlyFramedExplanation: 'Photosynthesis is the process where green plants use sunlight, water, and carbon dioxide to create their own food (glucose) for energy. This process takes place in the chloroplasts, using a green pigment called chlorophyll to capture light energy. Oxygen is released as a byproduct.'
    },
    submittedAt: new Date('2023-10-26T10:00:00Z'),
  },
  {
    id: 'resp2',
    studentId: 'S101',
    conceptId: 'c3',
    answers: [
      { questionId: 'q3', answerText: 'It is how plants breathe and make food with water and sun.' },
      { questionId: 'q4', answerText: 'The sun is like a battery for the plant. No sun, no power, the plant gets sad and droopy.' }
    ],
    feedback: {
      correctPoints: 'You\'ve got the main idea that it involves making food with water and sun. Your analogy of the sun as a battery is a good way to think about its role!',
      incorrectPoints: 'Saying plants "breathe" can be confusing. Plants perform respiration (which is like breathing), but photosynthesis is specifically about making food. You missed mentioning carbon dioxide as a key ingredient.',
      correctlyFramedExplanation: 'Photosynthesis is the process where green plants use sunlight, water, and carbon dioxide to create their own food (glucose) for energy. This process takes place in the chloroplasts, using a green pigment called chlorophyll to capture light energy. Oxygen is released as a byproduct.'
    },
    submittedAt: new Date('2023-10-26T10:05:00Z'),
  }
];

export const teacherDashboardData: TeacherConceptStats[] = [
  {
    conceptId: 'c1',
    understanding: { strong: 60, partial: 30, weak: 10 },
    commonMisconceptions: ['Confusing hypotenuse with other sides.', 'Calculation errors in squaring numbers.']
  },
  {
    conceptId: 'c2',
    understanding: { strong: 45, partial: 40, weak: 15 },
    commonMisconceptions: ['Forgetting the +/- in the quadratic formula.', 'Errors in factorization.']
  },
  {
    conceptId: 'c3',
    understanding: { strong: 70, partial: 25, weak: 5 },
    commonMisconceptions: ['Forgetting carbon dioxide is an input.', 'Confusing photosynthesis with respiration.']
  },
  {
    conceptId: 'c4',
    understanding: { strong: 55, partial: 35, weak: 10 },
    commonMisconceptions: ['"Action and reaction forces cancel each other out." (They act on different objects).', 'Thinking inertia is a force.']
  }
];

export const adminConceptDifficultyData: AdminConceptDifficulty[] = [
    { className: 'Class 10A', conceptName: 'Quadratic Equations', difficulty: 75 },
    { className: 'Class 10B', conceptName: 'Quadratic Equations', difficulty: 85 },
    { className: 'Class 9A', conceptName: 'Pythagorean Theorem', difficulty: 40 },
    { className: 'Class 9B', conceptName: 'Pythagorean Theorem', difficulty: 45 },
    { className: 'Class 10A', conceptName: 'Photosynthesis', difficulty: 30 },
];

export const adminTrendsData: AdminTrend[] = [
    { date: 'Jan', 'Average Understanding': 65 },
    { date: 'Feb', 'Average Understanding': 68 },
    { date: 'Mar', 'Average Understanding': 72 },
    { date: 'Apr', 'Average Understanding': 71 },
    { date: 'May', 'Average Understanding': 75 },
    { date: 'Jun', 'Average Understanding': 80 },
];
