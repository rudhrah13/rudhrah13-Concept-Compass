'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Lightbulb, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock Data for the feedback page
const mockFeedback = {
  understandingLevel: 'Partial',
  strengths: ['You correctly explained the role of sunlight.'],
  gaps: ['The food preparation process was incomplete.'],
  correctExplanation: 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create their own food (glucose) and release oxygen as a byproduct.',
};

export default function FeedbackPage() {
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Button asChild variant="outline" className="mb-4">
        <Link href="/student/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Concepts</Link>
      </Button>
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Your Feedback</h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="font-semibold">Understanding Level:</p>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            {mockFeedback.understandingLevel}
          </Badge>
        </div>
      </header>

      <div className="space-y-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle />
              What you did well
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-800">
            <ul className="list-disc list-inside">
              {mockFeedback.strengths.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle />
              What needs improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-800">
            <ul className="list-disc list-inside">
              {mockFeedback.gaps.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Lightbulb />
              Correct Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{mockFeedback.correctExplanation}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
