'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Lightbulb,
  Loader2,
  X,
  AlertTriangle,
  MessageSquare,
  Mic
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { UnderstandingLevel, DemoEvaluation } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { getEvaluations, getConcepts, initializeDemoData } from '@/lib/demo-data';


const getUnderstandingSummary = (level: UnderstandingLevel) => {
  switch (level) {
    case 'Strong':
      return { icon: <Check className="h-5 w-5 text-green-500" />, text: 'You’ve got it!', emoji: '✅' };
    case 'Partial':
      return { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, text: 'You’re almost there!', emoji: '👍' };
    case 'Weak':
    default:
      return { icon: <X className="h-5 w-5 text-red-500" />, text: 'Let’s improve this!', emoji: '🔄' };
  }
};

export default function FeedbackPage() {
  const params = useParams();
  const id = params.id as string; // This is the conceptId
  useProtectedRoute('student');
  
  const [evaluation, setEvaluation] = useState<DemoEvaluation | null>(null);
  const [conceptName, setConceptName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    initializeDemoData();

    setTimeout(() => {
        try {
            const studentId = localStorage.getItem('studentId');
            if (!studentId) {
                setError("Student not found. Please log in again.");
                setLoading(false);
                return;
            }

            const allEvaluations: DemoEvaluation[] = getEvaluations();
            const studentEvaluation = allEvaluations.find(e => e.studentId === studentId && e.conceptId === id);
            
            setEvaluation(studentEvaluation || null);

            if (studentEvaluation) {
                const concept = getConcepts().find(c => c.conceptId === id);
                setConceptName(concept?.chapter || 'Unknown Concept');
            }
            
        } catch (e) {
            setError("Failed to load feedback.");
        } finally {
            setLoading(false);
        }
    }, 500);
  };

  useEffect(() => {
    fetchData();
  }, [id]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> Loading feedback...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchData}>Try Again</Button>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Your feedback will appear here after you complete the concept.</p>
         <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/student/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Concepts
            </Link>
        </Button>
      </div>
    );
  }

  const summary = getUnderstandingSummary(evaluation.evaluation.understanding);

  return (
    <div className="container mx-auto max-w-4xl py-6 sm:py-8">
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link href="/student/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Concepts
        </Link>
      </Button>
      
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Feedback for {conceptName}</h1>
        <p className="text-muted-foreground">Review your conversation and the AI-generated feedback below.</p>
      </header>

      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare />Your Conversation</CardTitle>
                <CardDescription>
                    Below is exactly what you heard and said during the interaction.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {evaluation.conversation.questionsAsked.map((q, index) => (
                   <div key={index} className="rounded-lg border bg-background p-4 space-y-4">
                        {/* Question Block */}
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-semibold text-sm">
                                AI
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-muted-foreground">AI asked</p>
                                <p className="text-sm">{q.questionText}</p>
                            </div>
                        </div>
                        {/* Answer Block */}
                        <div className="flex items-start gap-3 ml-4 md:ml-10">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-primary font-semibold text-sm">
                                You
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-blue-800">You said</p>
                                <blockquote className="text-sm italic text-blue-900">
                                    "{evaluation.conversation.studentResponses[index]}"
                                </blockquote>
                            </div>
                        </div>
                   </div>
                ))}
            </CardContent>
        </Card>
        
        <Separator />
        
        <h2 className="text-xl font-semibold text-center text-muted-foreground pt-2">AI Feedback</h2>

        {/* Section 1: Understanding Summary */}
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {summary.icon}
              <span className="font-semibold text-lg">{summary.text} {summary.emoji}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <span>{evaluation.evaluation.understanding === 'Strong' ? 'Clear' : evaluation.evaluation.understanding === 'Partial' ? 'Almost there' : 'Needs work'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Concept Feedback */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {evaluation.evaluation.strength && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                <Check className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base font-semibold text-green-800">
                  What you did well
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-green-900">
                <p>
                  {evaluation.evaluation.strength.replace('Student', 'You')}
                </p>
              </CardContent>
            </Card>
          )}
          {evaluation.evaluation.gap && (
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-base font-semibold text-yellow-800">
                  What to focus on
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-yellow-900">
                <p>
                  {evaluation.evaluation.gap.replace('Student', 'You')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className='flex items-center gap-2 pt-2 text-sm text-muted-foreground'>
            <Mic className="h-4 w-4" />
            <p>Confidence: <span className='font-semibold'>{evaluation.evaluation.language.confidence}</span></p>
        </div>


        {/* Section 3: Correct Explanation */}
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
                  {evaluation.correctExplanation}
                </p>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>

        {/* Section 4: Action Button */}
        <div className="text-center pt-4">
          <Button asChild variant="default">
            <Link href={`/student/concept/${id}`}>Try this concept again later</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
