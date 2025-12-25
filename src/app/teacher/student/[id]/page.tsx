'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Check,
  X,
  Lightbulb,
  ArrowLeft,
  ThumbsUp,
  AlertTriangle,
  BookOpen,
  Pencil,
  Puzzle,
  ChevronRight,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type UnderstandingLevel = 'Strong' | 'Partial' | 'Weak';

const mockStudentData = {
    name: 'Anonymized Student 1',
    rollNumber: 'S101',
    questions: [
        'Explain photosynthesis in your own words.',
        'What happens if sunlight is not available?',
    ],
    studentAnswers: [
        'Photosynthesis is when plants make their own food. They use sunlight and water. It is green.',
        'If there is no sun, the plant will die because it cannot make food.',
    ],
    feedback: {
        conceptUnderstanding: 'Partial' as UnderstandingLevel,
        conceptFeedback: {
            strength: 'You correctly identified that plants use sunlight to make food.',
            gap: 'The role of carbon dioxide was missing, and the explanation of the food-making process could be more detailed.',
        },
        languageFeedback: {
            spelling: ['photosynthesis'],
            clarity: 'Try using shorter sentences to explain the steps.',
        },
        correctExplanation: 'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide from the air to create their own food (sugar/glucose) for energy, releasing oxygen as a byproduct.',
    }
};


const getUnderstandingSummary = (level: UnderstandingLevel) => {
  switch (level) {
    case 'Strong':
      return {
        icon: <Check className="h-5 w-5 text-green-500" />,
        text: 'Strong Understanding',
        pill: 'Clear',
        emoji: '✅',
      };
    case 'Partial':
      return {
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        text: 'Partial Understanding',
        pill: 'Almost there',
        emoji: '👍',
      };
    case 'Weak':
    default:
      return {
        icon: <X className="h-5 w-5 text-red-500" />,
        text: 'Weak Understanding',
        pill: 'Needs work',
        emoji: '🔄',
      };
  }
};

export default function TeacherStudentFeedbackPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const conceptName = searchParams.get('concept') || 'Concept';
  const summary = getUnderstandingSummary(mockStudentData.feedback.conceptUnderstanding);

  return (
    <div className="container mx-auto max-w-4xl py-6 sm:py-8">
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link href="/teacher/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>

      <header className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">{mockStudentData.name} ({mockStudentData.rollNumber})</h1>
                <p className="text-muted-foreground">{conceptName}</p>
            </div>
            <Badge variant="outline">Teacher View</Badge>
        </div>
      </header>

      <div className="space-y-6">
        
        {/* Section 1: Questions and Answers */}
        <Card>
            <CardHeader>
                <CardTitle>Student's Submission</CardTitle>
                <CardDescription>The questions asked and the answers provided by the student.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {mockStudentData.questions.map((question, index) => (
                    <div key={index}>
                        <p className="font-semibold text-primary">{question}</p>
                        <blockquote className="mt-2 border-l-2 pl-4 italic text-muted-foreground">
                            {mockStudentData.studentAnswers[index]}
                        </blockquote>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Separator />
        
        <h2 className="text-xl font-semibold text-center text-muted-foreground pt-2">AI Generated Feedback (Identical to Student View)</h2>

        {/* Section 2: Understanding Summary */}
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {summary.icon}
              <span className="font-semibold text-lg">{summary.text} {summary.emoji}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <span>{summary.pill}</span>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Concept Feedback */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mockStudentData.feedback.conceptFeedback.strength && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base font-semibold text-green-800">
                  Good job
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-green-900">
                <p className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0" />
                  <span>{mockStudentData.feedback.conceptFeedback.strength}</span>
                </p>
              </CardContent>
            </Card>
          )}
          {mockStudentData.feedback.conceptFeedback.gap && (
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-base font-semibold text-yellow-800">
                  Fix this
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-yellow-900">
                <p className="flex items-start gap-2">
                  <X className="mt-1 h-4 w-4 flex-shrink-0" />
                  <span>{mockStudentData.feedback.conceptFeedback.gap}</span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Section 4: Expression Tips */}
        {(mockStudentData.feedback.languageFeedback.spelling ||
          mockStudentData.feedback.languageFeedback.clarity) && (
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base font-semibold">
                Expression Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0 text-sm text-muted-foreground">
              {mockStudentData.feedback.languageFeedback.spelling && (
                <div className="flex items-start gap-3">
                  <Pencil className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Spelling: Check the spelling of &quot;
                    {mockStudentData.feedback.languageFeedback.spelling.join(', ')}&quot;.
                  </p>
                </div>
              )}
              {mockStudentData.feedback.languageFeedback.clarity && (
                <div className="flex items-start gap-3">
                  <Puzzle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Sentence clarity: {mockStudentData.feedback.languageFeedback.clarity}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Section 5: Correct Explanation */}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-b-0">
            <Card className="p-0">
              <AccordionTrigger className="flex w-full items-center justify-between p-4 text-base font-semibold text-primary hover:no-underline">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  See a clear explanation
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-muted-foreground">
                  {mockStudentData.feedback.correctExplanation}
                </p>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}