import { notFound } from 'next/navigation';
import Link from 'next/link';
import { evaluations, attempts, concepts } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Lightbulb, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const evaluation = evaluations.find(r => r.id === params.id);
  const attempt = attempts.find(a => a.id === evaluation?.attemptId);
  const concept = concepts.find(c => c.id === attempt?.conceptId);

  if (!evaluation || !attempt || !concept) {
    notFound();
  }

  const { understandingLevel, strengths, gaps, correctExplanation } = evaluation;

  const getBadgeClass = () => {
    switch(understandingLevel) {
        case 'Strong': return 'bg-green-500';
        case 'Partial': return 'bg-yellow-500';
        case 'Weak': return 'bg-red-500';
    }
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">{concept.name}</p>
          <div className="flex items-center gap-4 mt-1">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Your Feedback</h1>
            <Badge className={getBadgeClass()}>
                {understandingLevel} Understanding
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-green-500/10 border-green-500/30 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 />
                What you did well
              </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-green-800">
                    {strengths.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
            </CardContent>
          </Card>

          <Card className="bg-red-500/10 border-red-500/30 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <XCircle />
                What needs improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-red-800">
                    {gaps.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
            </CardContent>
          </Card>

          <Separator />

          <Card className="bg-secondary/50 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb />
                Correctly framed explanation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{correctExplanation}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
            <Button asChild variant="outline">
                <Link href="/student/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to Dashboard
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
