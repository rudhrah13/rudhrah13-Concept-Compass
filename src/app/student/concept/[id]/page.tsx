import { notFound } from 'next/navigation';
import { concepts, questions as allQuestions } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { submitResponse } from './actions';
import { Lightbulb } from 'lucide-react';

export default function ConceptPage({ params }: { params: { id: string } }) {
  const concept = concepts.find(c => c.id === params.id);
  const questions = allQuestions.filter(q => q.conceptId === params.id);

  if (!concept || questions.length === 0) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-primary font-semibold">{concept.name}</p>
          <h1 className="text-4xl font-bold tracking-tight font-headline">Test Your Knowledge</h1>
          <p className="text-lg text-muted-foreground mt-2">Answer the following questions in your own words.</p>
        </div>

        <Card className="shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400"/>
                Your Explanation
            </CardTitle>
            <CardDescription>Think carefully and provide detailed answers.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitResponse} className="space-y-8">
              <input type="hidden" name="conceptId" value={concept.id} />
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <input type="hidden" name={`questionId_${index}`} value={question.id} />
                  <Label htmlFor={`answer_${index}`} className="text-base font-medium">
                    {`Question ${index + 1}: ${question.questionText}`}
                  </Label>
                  <Textarea
                    id={`answer_${index}`}
                    name={`answer_${index}`}
                    placeholder="Type your answer here..."
                    required
                    rows={5}
                    className="text-base"
                  />
                </div>
              ))}
              <Button type="submit" className="w-full">Submit for Feedback</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
