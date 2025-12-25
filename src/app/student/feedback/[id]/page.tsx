'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Check,
  X,
  Lightbulb,
  ArrowLeft,
  ThumbsUp,
  RotateCw,
  AlertTriangle,
  BookOpen,
  Pencil,
  Puzzle,
  Mic,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type UnderstandingLevel = 'Strong' | 'Partial' | 'Weak';

// Mock Data for the feedback page, based on new requirements
const mockFeedback = {
  conceptUnderstanding: 'Partial' as UnderstandingLevel,
  conceptFeedback: {
    strength: 'Correctly explained the role of sunlight.',
    gap: 'The food preparation process was incomplete.',
  },
  languageFeedback: {
    spelling: ['photosynthesis'],
    clarity: 'Try using shorter sentences to explain the steps.',
    // pronunciation: ['carbon dioxide'], // Example of optional data
  },
  correctExplanation:
    'Photosynthesis is how plants use sunlight, water, and air to make their own food (sugar) and release oxygen.',
};

const getUnderstandingSummary = (level: UnderstandingLevel) => {
  switch (level) {
    case 'Strong':
      return {
        icon: <Check className="h-5 w-5 text-green-500" />,
        text: 'You’ve got it!',
        pill: 'Clear',
        emoji: '✅',
      };
    case 'Partial':
      return {
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        text: 'You’re almost there!',
        pill: 'Almost there',
        emoji: '👍',
      };
    case 'Weak':
    default:
      return {
        icon: <X className="h-5 w-5 text-red-500" />,
        text: 'Let’s improve this!',
        pill: 'Needs work',
        emoji: '🔄',
      };
  }
};

export default function FeedbackPage() {
  const summary = getUnderstandingSummary(mockFeedback.conceptUnderstanding);

  return (
    <div className="container mx-auto max-w-4xl py-6 sm:py-8">
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link href="/student/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Concepts
        </Link>
      </Button>

      <div className="space-y-4">
        {/* Section 1: Understanding Summary */}
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

        {/* Section 2: Concept Feedback */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mockFeedback.conceptFeedback.strength && (
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
                  <span>{mockFeedback.conceptFeedback.strength}</span>
                </p>
              </CardContent>
            </Card>
          )}
          {mockFeedback.conceptFeedback.gap && (
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
                  <span>{mockFeedback.conceptFeedback.gap}</span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Section 3: Expression Tips */}
        {(mockFeedback.languageFeedback.spelling ||
          mockFeedback.languageFeedback.clarity) && (
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base font-semibold">
                Expression Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0 text-sm text-muted-foreground">
              {mockFeedback.languageFeedback.spelling && (
                <div className="flex items-start gap-3">
                  <Pencil className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Spelling: Check the spelling of &quot;
                    {mockFeedback.languageFeedback.spelling.join(', ')}&quot;.
                  </p>
                </div>
              )}
              {mockFeedback.languageFeedback.clarity && (
                <div className="flex items-start gap-3">
                  <Puzzle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Sentence clarity: {mockFeedback.languageFeedback.clarity}
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
                  {mockFeedback.correctExplanation}
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