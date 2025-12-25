import { notFound } from 'next/navigation';
import { concepts, questions as allQuestions } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { submitResponse } from './actions';

export default function ConceptPage({ params }: { params: { id: string } }) {
  const concept = concepts.find(c => c.id === params.id);
  const questions = allQuestions.filter(q => q.conceptId === params.id);

  if (!concept || questions.length === 0) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-primary font-semibold">{concept.name}</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Explain the idea in your own words.</h1>
          <p className="text-md text-muted-foreground mt-1">This is not an exam.</p>
        </div>

        <Card className="shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle>Guided Questions</CardTitle>
            <CardDescription>Think carefully and provide detailed answers.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitResponse} className="space-y-8">
              <input type="hidden" name="conceptId" value={concept.id} />
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <input type="hidden" name={`questionId_${index}`} value={question.id} />
                  <Label htmlFor={`answer_${index}`} className="text-base font-medium">
                    {question.questionText}
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
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
