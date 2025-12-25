import { notFound } from 'next/navigation';
import Link from 'next/link';
import { studentResponses } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Lightbulb, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const response = studentResponses.find(r => r.id === params.id);

  if (!response?.feedback) {
    notFound();
  }

  const { correctPoints, incorrectPoints, correctlyFramedExplanation } = response.feedback;

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight font-headline">Your Feedback</h1>
          <p className="text-lg text-muted-foreground mt-2">Here's a breakdown of your understanding.</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-accent/20 border-accent shadow-md animate-in fade-in-0 zoom-in-95 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 />
                What You Got Right
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-green-800">{correctPoints}</p>
            </CardContent>
          </Card>

          <Card className="bg-destructive/10 border-destructive/50 shadow-md animate-in fade-in-0 zoom-in-95 duration-500 delay-150">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle />
                Points to Clarify
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-destructive/90">{incorrectPoints}</p>
            </CardContent>
          </Card>

          <Separator />

          <Card className="bg-secondary/50 shadow-md animate-in fade-in-0 zoom-in-95 duration-500 delay-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb />
                Correct Explanation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{correctlyFramedExplanation}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
            <Button asChild variant="outline">
                <Link href="/student/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Assess Another Concept
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
