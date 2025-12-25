import { notFound } from 'next/navigation';
import Link from 'next/link';
import { concepts, studentResponses } from '@/lib/mock-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function TeacherConceptDetailsPage({ params }: { params: { id: string } }) {
  const concept = concepts.find(c => c.id === params.id);
  const responses = studentResponses.filter(r => r.conceptId === params.id);

  if (!concept) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-8">
        <Button asChild variant="outline" size="icon" className="mr-4">
          <Link href="/teacher/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Concept Details</p>
          <h1 className="text-3xl font-bold tracking-tight font-headline">{concept.name}</h1>
        </div>
      </div>
      
      {responses.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {responses.map((response, index) => (
            <AccordionItem key={response.id} value={response.id} className="border rounded-lg bg-card shadow-sm">
              <AccordionTrigger className="px-6 text-lg hover:no-underline">
                Anonymous Student #{index + 1}
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <div className="space-y-6">
                  {response.answers.map((ans, i) => (
                    <div key={i}>
                      <p className="font-semibold text-muted-foreground">Question {i+1}:</p>
                      <p className="italic">"{ans.answerText}"</p>
                    </div>
                  ))}
                  
                  {response.feedback && (
                    <>
                      <Separator/>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-green-50 border-green-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2 text-green-700"><CheckCircle2 size={16}/>Correct Points</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-green-800">{response.feedback.correctPoints}</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-red-50 border-red-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2 text-red-700"><XCircle size={16}/>Incorrect Points</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-red-800">{response.feedback.incorrectPoints}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No Responses Yet</h2>
            <p className="text-muted-foreground mt-2">No students have submitted responses for this concept yet.</p>
        </div>
      )}
    </div>
  );
}
