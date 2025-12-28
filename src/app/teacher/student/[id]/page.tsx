'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Lightbulb,
  Loader2,
  Mic,
  Smile,
  Meh,
  Frown,
  Target,
  ThumbsUp,
  User,
  X,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { StudentProfile, UnderstandingLevel, DemoStudent, DemoConcept, DemoEvaluation } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { getStudents, getConcepts, getEvaluations, initializeDemoData } from '@/lib/demo-data';


const getUnderstandingBadge = (level: UnderstandingLevel) => {
    switch (level) {
        case 'Strong':
            return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Strong</Badge>;
        case 'Weak':
            return <Badge variant="destructive" className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Weak</Badge>;
        case 'Partial':
        default:
            return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Partial</Badge>;
    }
}

export default function TeacherStudentOverviewPage() {
    useProtectedRoute('teacher');
    const searchParams = useSearchParams();
    const params = useParams();
    const studentId = params.id as string;
    const fromConceptId = searchParams.get('fromConcept');
    const showFeedback = searchParams.get('showFeedback');

    useEffect(() => {
        initializeDemoData();
    }, []);

    // If showFeedback is true, render the detailed feedback view for the concept.
    if (showFeedback && fromConceptId) {
        return <StudentConceptFeedbackView studentId={studentId} conceptId={fromConceptId} />;
    }
    
    // Otherwise, show the main student profile view.
    return <StudentProfileView studentId={studentId} fromConceptId={fromConceptId} />;
}

function StudentProfileView({ studentId, fromConceptId }: { studentId: string, fromConceptId: string | null }) {
    const [student, setStudent] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fromConcept = fromConceptId ? getConcepts().find(c => c.conceptId === fromConceptId) : null;
    const fromConceptEvaluation = fromConceptId ? getEvaluations().find(e => e.studentId === studentId && e.conceptId === fromConceptId) : null;

    const backUrl = fromConceptId ? `/teacher/concept/${fromConceptId}` : '/teacher/dashboard';
    const backText = fromConceptId ? `Back to ${fromConcept?.conceptName}` : 'Back to Dashboard';

    const fetchData = () => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
           try {
            const studentData = getStudents().find(s => s.studentId === studentId);
            if (!studentData) {
                setError("Student not found.");
                setLoading(false);
                return;
            }

            const studentEvaluations = getEvaluations().filter(e => e.studentId === studentId);
            const allConcepts = getConcepts();

            const strongConcepts = studentEvaluations.filter(e => e.evaluation.understanding === 'Strong').length;
            const needsWork = studentEvaluations.length - strongConcepts;
            
            const gapCounts: { [key: string]: number } = {};
            studentEvaluations.forEach(e => {
                if (e.evaluation.gap && e.evaluation.gap !== 'None') {
                    gapCounts[e.evaluation.gap] = (gapCounts[e.evaluation.gap] || 0) + 1;
                }
            });

            const sortedGaps = Object.keys(gapCounts).sort((a, b) => gapCounts[b] - gapCounts[a]);
            const repeatedIssue = sortedGaps.length > 0 ? sortedGaps[0] : 'No specific repeated issues found.';

            const profile: StudentProfile = {
                id: studentData.studentId,
                name: studentData.name,
                rollNumber: studentData.studentId,
                snapshot: {
                    strongConcepts,
                    needsWork,
                    repeatedIssue,
                },
                patterns: [ // This would require more complex analysis in a real app
                    'Explanation clarity issues',
                    'Application difficulty',
                ],
                focusActions: [ // This would be AI-generated
                    'Encourage oral explanation for concepts.',
                    'Suggest using shorter, simpler sentences.',
                ],
                recentConcepts: studentEvaluations
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(e => {
                        const concept = allConcepts.find(c => c.conceptId === e.conceptId);
                        return {
                            id: e.conceptId,
                            name: concept?.conceptName || 'Unknown Concept',
                            status: e.evaluation.understanding,
                            date: new Date(e.date).toLocaleDateString(),
                        }
                    }).slice(0, 5), // Limit to recent 5
            };
            setStudent(profile);
           } catch(e) {
                setError("Failed to load student profile.");
           } finally {
                setLoading(false);
           }
        }, 500);
    };

    useEffect(fetchData, [studentId]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> Loading student profile...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchData}>Try Again</Button>
            </div>
        );
    }
  
    if (!student) {
        return (
            <div className="container mx-auto py-10 text-center">
                <p>Student not found.</p>
                <Button asChild variant="link"><Link href="/teacher/dashboard">Back to Dashboard</Link></Button>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto max-w-4xl py-6 sm:py-8">
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link href={backUrl}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> {backText}
                </Link>
            </Button>

            <header className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{student.name} ({student.rollNumber})</h1>
                        <p className="text-muted-foreground">Overall Student Profile</p>
                    </div>
                    <Badge variant="outline">Teacher View</Badge>
                </div>
            </header>

            <div className="space-y-6">

                {fromConcept && (
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-800"><Sparkles className="w-5 h-5" />Concept in Context</CardTitle>
                            <CardDescription>You are viewing this student's profile in the context of the '{fromConcept.conceptName}' concept.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {fromConceptEvaluation ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-background border">
                                    <div className='space-y-1'>
                                        <p className="font-semibold">{fromConcept.conceptName}</p>
                                        <div className='flex items-center gap-2'>
                                            <span className="text-sm text-muted-foreground">Status:</span>
                                            {getUnderstandingBadge(fromConceptEvaluation.evaluation.understanding)}
                                        </div>
                                    </div>
                                    <Button onClick={() => router.push(`/teacher/student/${studentId}?fromConcept=${fromConceptId}&showFeedback=true`)}>
                                        View Detailed Feedback
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">This student has not yet attempted the '{fromConcept.conceptName}' concept.</p>
                            )}
                        </CardContent>
                    </Card>
                )}


                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />Overall Snapshot</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <p className="text-3xl font-bold text-green-600">{student.snapshot.strongConcepts}</p>
                            <p className="text-sm font-medium">Strong Concepts</p>
                        </div>
                        <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                            <p className="text-3xl font-bold text-yellow-600">{student.snapshot.needsWork}</p>
                            <p className="text-sm font-medium">Needs Work</p>
                        </div>
                        <div className="p-4 bg-red-500/10 rounded-lg col-span-1 md:col-span-3 text-left border border-red-500/20">
                            <p className="font-semibold text-red-600">Repeated Issue</p>
                            <p className="text-sm text-muted-foreground">{student.snapshot.repeatedIssue}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Concept Attempts</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="flex flex-col gap-3">
                            {student.recentConcepts.length > 0 ? student.recentConcepts.map(concept => (
                                <Link key={concept.id} href={`/teacher/student/${studentId}?fromConcept=${concept.id}`} className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors group">
                                    <div>
                                        <p className="font-medium">{concept.name}</p>
                                        <p className="text-sm text-muted-foreground">{concept.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {getUnderstandingBadge(concept.status)}
                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                                    </div>

                                </Link>
                            )) : <p className="text-muted-foreground text-center py-4">No recent attempts found.</p>}
                        </div>
                    </CardContent>
                </Card>

                 <Accordion type="single" collapsible className="w-full space-y-2">
                    <AccordionItem value="detailed-analysis" className="border-b-0 rounded-lg bg-card shadow-sm">
                        <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                            <div className="flex items-center gap-4">
                            Detailed Analysis
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" />Repeated Learning Patterns</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    {student.patterns.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" />Suggested Focus Actions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                        {student.focusActions.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}

function StudentConceptFeedbackView({ studentId, conceptId }: { studentId: string, conceptId: string }) {
  const [evaluation, setEvaluation] = useState<DemoEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const student = getStudents().find(s => s.studentId === studentId);
  const concept = getConcepts().find(c => c.conceptId === conceptId);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
        try {
            const evalData = getEvaluations().find(e => e.studentId === studentId && e.conceptId === conceptId);
            setEvaluation(evalData || null);
        } catch (e) {
            setError("Failed to load evaluation data.");
        } finally {
            setLoading(false);
        }
    }, 500);
  };
  useEffect(fetchData, [studentId, conceptId]);
  
  const getUnderstandingSummary = (level: UnderstandingLevel) => {
    switch (level) {
      case 'Strong':
        return { icon: <Check className="h-5 w-5 text-green-500" />, text: 'Strong Understanding', emoji: '✅' };
      case 'Partial':
        return { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, text: 'Partial Understanding', emoji: '👍' };
      case 'Weak':
      default:
        return { icon: <X className="h-5 w-5 text-red-500" />, text: 'Weak Understanding', emoji: '🔄' };
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> Loading attempt...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchData}>Try Again</Button>
      </div>
    );
  }
  
  if (!student || !concept) {
     return (
      <div className="container mx-auto py-10 text-center">
        <p>Student or concept data not found.</p>
        <Button asChild variant="link"><Link href="/teacher/dashboard">Back to Dashboard</Link></Button>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>This student has not attempted this concept yet.</p>
        <div className="flex justify-center items-center gap-4 mt-4">
             <Button asChild variant="outline" size="sm">
                <Link href={`/teacher/student/${studentId}`}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Student Profile</Link>
             </Button>
             <Button asChild variant="outline" size="sm">
                <Link href={`/teacher/concept/${conceptId}`}>Back to Concept Overview</Link>
            </Button>
        </div>
      </div>
    );
  }

  const summary = getUnderstandingSummary(evaluation.evaluation.understanding);

  return (
    <div className="container mx-auto max-w-4xl py-6 sm:py-8">
      <div className="flex justify-between items-center mb-4">
        <Button asChild variant="outline" size="sm">
            <Link href={`/teacher/student/${student.studentId}?fromConcept=${conceptId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Student Profile
            </Link>
        </Button>
      </div>

      <header className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">{student.name} ({student.studentId})</h1>
                <p className="text-muted-foreground">{concept.conceptName}</p>
            </div>
            <Badge variant="outline">Teacher View</Badge>
        </div>
      </header>

      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare />Student Conversation</CardTitle>
                 <CardDescription>
                    Below is exactly what the student heard and said during the interaction.
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
                                S
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-blue-800">Student said</p>
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
        
        <h2 className="text-xl font-semibold text-center text-muted-foreground pt-2">Understanding Analysis</h2>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {summary.icon}
              <span className="font-semibold text-lg">{summary.text}</span>
            </div>
             <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <span>{getUnderstandingBadge(evaluation.evaluation.understanding)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {evaluation.evaluation.strength && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base font-semibold text-green-800">
                  What the student understood
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-green-900">
                <p className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0" />
                  <span>{evaluation.evaluation.strength.replace('Student', 'The student')}</span>
                </p>
              </CardContent>
            </Card>
          )}
          {evaluation.evaluation.gap && (
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-base font-semibold text-yellow-800">
                  Where the student is confused
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-yellow-900">
                <p className="flex items-start gap-2">
                  <X className="mt-1 h-4 w-4 flex-shrink-0" />
                  <span>{evaluation.evaluation.gap.replace('Student', 'The student')}</span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {evaluation.evaluation.nextSteps && evaluation.evaluation.nextSteps.length > 0 && (
            <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-blue-800">
                        <Sparkles className="h-5 w-5" />
                        Suggested focus areas for this student
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-900">
                    <ul className="list-disc list-inside space-y-2">
                        {evaluation.evaluation.nextSteps.map((step, i) => (
                            <li key={i}>{step}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        )}

        <div className='flex items-center gap-2 pt-2 text-sm text-muted-foreground'>
            <Mic className="h-4 w-4" />
            <p>Confidence: <span className='font-semibold'>{evaluation.evaluation.language.confidence}</span></p>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-b-0">
            <Card className="p-0">
              <AccordionTrigger className="flex w-full items-center justify-between p-4 text-base font-semibold text-primary hover:no-underline">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Correct Explanation (for Teacher)
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
      </div>
    </div>
  );
}
