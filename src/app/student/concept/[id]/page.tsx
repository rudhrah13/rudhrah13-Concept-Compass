'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Mock data, in a real app this would come from an API
const conceptData = {
  id: 'sci1',
  title: 'Photosynthesis',
  questions: [
    'Explain photosynthesis in your own words.',
    'What happens if sunlight is not available?',
  ],
};

export default function ConceptPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Navigate to feedback page on submit
    router.push(`/student/feedback/${params.id}`);
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
       <Button asChild variant="outline" className="mb-4">
        <Link href="/student/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Concepts</Link>
      </Button>

      <header className="mb-8">
        <p className="text-lg font-semibold text-primary">{conceptData.title}</p>
        <h1 className="text-3xl font-bold">Explain the idea in your own words.</h1>
        <p className="text-muted-foreground mt-2">This is not an exam.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Guided Questions</CardTitle>
          <CardDescription>Answer the questions below to the best of your ability.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {conceptData.questions.map((q, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`question-${index}`} className="text-base font-medium">{q}</Label>
                <Textarea
                  id={`question-${index}`}
                  placeholder="Type your answer here..."
                  rows={5}
                  className="bg-background"
                />
              </div>
            ))}
            <Button type="submit" className="w-full" size="lg">Submit Answers</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
