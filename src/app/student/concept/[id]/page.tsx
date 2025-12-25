'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Concept, ConceptAttempt } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';

// Mock data, in a real app this would come from an API
const mockConcept: Concept = {
  id: 'sci1',
  title: 'Photosynthesis',
  questions: [
    'Explain photosynthesis in your own words.',
    'What happens if sunlight is not available?',
  ],
};

export default function ConceptPage() {
  const params = useParams();
  const id = params.id as string;
  useProtectedRoute('student');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conceptData, setConceptData] = useState<Concept | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // To test error state: setError("Failed to load concept.");
      setConceptData(mockConcept);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would save the answers here
    router.push(`/student/feedback/${id}`);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Simulate refetch
    setTimeout(() => {
      setConceptData(mockConcept);
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> Loading concept...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={handleRetry}>Try Again</Button>
      </div>
    );
  }

  if (!conceptData) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Concept not found.</p>
        <Button asChild variant="link"><Link href="/student/dashboard">Back to Concepts</Link></Button>
      </div>
    );
  }

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
                  required
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
