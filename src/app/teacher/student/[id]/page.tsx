'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
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
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { StudentProfile, StudentAttempt, UnderstandingLevel, DemoStudent, DemoConcept, DemoEvaluation } from '@/types';
import { featureFlags } from '@/lib/feature-flags';
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

const getConfidenceIndicator = (confidence: string | undefined) => {
    switch (confidence?.toLowerCase()) {
        case 'high':
            return <><Smile className="h-4 w-4 text-green-600" /> Speaks confidently</>;
        case 'medium':
            return <><Meh className="h-4 w-4 text-yellow-600" /> Sometimes hesitant</>;
        case 'low':
            return <><Frown className="h-4 w-4 text-red-600" /> Very hesitant</>;
        default:
            return null;
    }
};

export default function TeacherStudentOverviewPage() {
    useProtectedRoute('teacher');
    const searchParams = useSearchParams();
    const params = useParams();
    const studentId = params.id as string;
    const conceptId = searchParams.get('concept');
    
    useEffect(() => {
        initializeDemoData();
    }, []);

    // Default to the new URL param based view
    const tab = searchParams.get('tab') || 'profile';

    if (conceptId) {
        return <StudentConceptFeedbackView studentId={studentId} conceptId={conceptId} />;
    }
    
    if (featureFlags.ENABLE_STUDENT_PROFILE) {
        return <StudentProfileView studentId={studentId} />;
    }
    
    // Fallback if profile is disabled
    return (
        <div className="container mx-auto py-10 text-center">
            <p>Student profiles are not enabled.</p>
            <Button asChild variant="link">
                <Link href="/teacher/dashboard">Back to Dashboard</Link>
            </Button>
        </div>
    );
}

function StudentProfileView({ studentId }: { studentId: string }) {
    const [student, setStudent] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                            name: concept?.chapter || 'Unknown Concept',
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
                <Link href="/teacher/dashboard?tabs=students">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Student List
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
                                <Link key={concept.id} href={`/teacher/student/${studentId}?concept=${concept.id}`} className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors group">
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
  const [attempt, setAttempt] = useState<StudentAttempt | null>(null);
  const [evaluation, setEvaluation] = useState<DemoEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const student = getStudents().find(s => s.studentId === studentId);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
        try {
            const evalData = getEvaluations().find(e => e.studentId === studentId && e.conceptId === conceptId);
            setEvaluation(evalData || null);

            if (!evalData) {
                setAttempt(null);
                setLoading(false);
                return;
            }
            const concept = getConcepts().find(c => c.conceptId === conceptId);

            const transformedAttempt: StudentAttempt = {
                conceptName: concept?.chapter || 'Unknown Concept',
                questions: ['Explain the concept in your own words.'], // Placeholder
                studentAnswers: ['Student answer was recorded via voice.'], // Placeholder
                feedback: {
                    understandingLevel: evalData.evaluation.understanding,
                    strength: evalData.evaluation.strength,
                    gap: evalData.evaluation.gap,
                    languageFeedback: {
                        clarity: evalData.evaluation.language.clarity,
                    },
                    correctExplanation: 'A correct explanation of the concept involves understanding its core principles and applications.'
                }
            };
            setAttempt(transformedAttempt);

        } catch (e) {
            setError("Failed to load attempt.");
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
  
  if (!attempt || !student) {
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

  const summary = getUnderstandingSummary(attempt.feedback.understandingLevel);

  return (
    <div className="container mx-auto max-w-4xl py-6 sm:py-8">
      <div className="flex justify-between items-center mb-4">
        <Button asChild variant="outline" size="sm">
            <Link href={`/teacher/student/${student.studentId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Student Profile
            </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
            <Link href={`/teacher/concept/${conceptId}`}>
             Back to Concept Overview
            </Link>
        </Button>
      </div>

      <header className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">{student.name} ({student.studentId})</h1>
                <p className="text-muted-foreground">{attempt.conceptName}</p>
            </div>
            <Badge variant="outline">Teacher View</Badge>
        </div>
      </header>

      <div className="space-y-6">
        
        <Card>
            <CardHeader>
                <CardTitle>Student's Submission</CardTitle>
                 <CardDescription className="flex items-center gap-2 pt-2">
                    <Mic className="h-4 w-4" />
                    {getConfidenceIndicator(evaluation?.evaluation.language.confidence)}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <blockquote className="mt-2 border-l-2 pl-4 italic text-muted-foreground">
                    Student answer was recorded via voice. Transcript not shown.
                </blockquote>
            </CardContent>
        </Card>

        <Separator />
        
        <h2 className="text-xl font-semibold text-center text-muted-foreground pt-2">AI Generated Feedback (Identical to Student View)</h2>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {summary.icon}
              <span className="font-semibold text-lg">{summary.text} {summary.emoji}</span>
            </div>
             <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <span>{attempt.feedback.understandingLevel === 'Strong' ? 'Clear' : attempt.feedback.understandingLevel === 'Partial' ? 'Almost there' : 'Needs work'}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {attempt.feedback.strength && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base font-semibold text-green-800">
                  Good job
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-green-900">
                <p className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0" />
                  <span>{attempt.feedback.strength}</span>
                </p>
              </CardContent>
            </Card>
          )}
          {attempt.feedback.gap && (
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-base font-semibold text-yellow-800">
                  Fix this
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-yellow-900">
                <p className="flex items-start gap-2">
                  <X className="mt-1 h-4 w-4 flex-shrink-0" />
                  <span>{attempt.feedback.gap}</span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-b-0">
            <Card className="p-0">
              <AccordionTrigger className="flex w-full items-center justify-between p-4 text-base font-semibold text-primary hover:no-underline" suppressHydrationWarning>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  See a clear explanation
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-muted-foreground">
                  {attempt.feedback.correctExplanation}
                </p>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
