'use client';

import Link from 'next/link';
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
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

type UnderstandingLevel = 'Strong' | 'Partial' | 'Weak';

// Mock Data for the feedback page
const mockAttemptData = {
  conceptName: 'Photosynthesis',
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
    correctExplanation:
      'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide from the air to create their own food (sugar/glucose) for energy, releasing oxygen as a byproduct.',
  },
};


const getUnderstandingSummary = (level: UnderstandingLevel) => {
  switch (level) {
    case 'Strong':
      return {
        icon: <Check className="h-5 w-5 text-green-500" />,
        text: 'You’ve got it!',
        emoji: '✅',
      };
    case 'Partial':
      return {
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        text: 'You’re almost there!',
        emoji: '👍',
      };
    case 'Weak':
    default:
      return {
        icon: <X className="h-5 w-5 text-red-500" />,
        text: 'Let’s improve this!',
        emoji: '🔄',
      };
  }
};

export default function FeedbackPage() {
  const attempt = mockAttemptData;
  const summary = getUnderstandingSummary(attempt.feedback.conceptUnderstanding);

  return (
    <div className="container mx-auto max-w-4xl py-6 sm:py-8">
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link href="/student/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Concepts
        </Link>
      </Button>
      
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Feedback for {attempt.conceptName}</h1>
        <p className="text-muted-foreground">Review your answers and the AI-generated feedback below.</p>
      </header>

      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Your Submission</CardTitle>
                <CardDescription>The questions you were asked and the answers you provided.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {attempt.questions.map((question, index) => (
                    <div key={index}>
                        <p className="font-semibold text-primary">{question}</p>
                        <blockquote className="mt-2 border-l-2 pl-4 italic text-muted-foreground">
                            {attempt.studentAnswers[index]}
                        </blockquote>
                    </div>
                ))}
            </CardContent>
        </Card>
        
        <Separator />
        
        <h2 className="text-xl font-semibold text-center text-muted-foreground pt-2">AI Generated Feedback</h2>


        {/* Section 1: Understanding Summary */}
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {summary.icon}
              <span className="font-semibold text-lg">{summary.text} {summary.emoji}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <span>{attempt.feedback.conceptUnderstanding === 'Strong' ? 'Clear' : attempt.feedback.conceptUnderstanding === 'Partial' ? 'Almost there' : 'Needs work'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Concept Feedback */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {attempt.feedback.conceptFeedback.strength && (
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
                  <span>{attempt.feedback.conceptFeedback.strength}</span>
                </p>
              </CardContent>
            </Card>
          )}
          {attempt.feedback.conceptFeedback.gap && (
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
                  <span>{attempt.feedback.conceptFeedback.gap}</span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Section 3: Expression Tips */}
        {(attempt.feedback.languageFeedback.spelling ||
          attempt.feedback.languageFeedback.clarity) && (
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base font-semibold">
                Expression Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0 text-sm text-muted-foreground">
              {attempt.feedback.languageFeedback.spelling && (
                <div className="flex items-start gap-3">
                  <Pencil className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Spelling: Check the spelling of &quot;
                    {attempt.feedback.languageFeedback.spelling.join(', ')}&quot;.
                  </p>
                </div>
              )}
              {attempt.feedback.languageFeedback.clarity && (
                <div className="flex items-start gap-3">
                  <Puzzle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Sentence clarity: {attempt.feedback.languageFeedback.clarity}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Section 4: Correct Explanation */}
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
                  {attempt.feedback.correctExplanation}
                </p>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>

        {/* Section 5: Action Button */}
        <div className="text-center pt-4">
          <Button asChild variant="default">
            <Link href="/student/dashboard">Try this concept again later</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
