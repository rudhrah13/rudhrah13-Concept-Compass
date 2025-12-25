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
  Pencil,
  Puzzle,
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
import type { StudentProfile, StudentAttempt, UnderstandingLevel } from '@/types';
import { featureFlags } from '@/lib/feature-flags';
import { useProtectedRoute } from '@/hooks/use-protected-route';

const mockStudentProfileData: StudentProfile = {
    id: '1',
    name: 'Anonymized Student 1',
    rollNumber: 'S101',
    snapshot: {
        strongConcepts: 5,
        needsWork: 8,
        repeatedIssue: 'Difficulty in applying concepts to new situations.',
    },
    patterns: [
        'Explanation clarity issues',
        'Application difficulty',
        'Language improvement needed'
    ],
    focusActions: [
        'Encourage oral explanation for concepts.',
        'Suggest using shorter, simpler sentences.',
        'Pair with a peer for revision sessions.',
    ],
    recentConcepts: [
        { id: 'photosynthesis', name: 'Photosynthesis', status: 'Partial', date: '2 days ago' },
        { id: 'respiration', name: 'Respiration', status: 'Weak', date: '5 days ago' },
        { id: 'light-reflection', name: 'Light Reflection', status: 'Strong', date: '1 week ago' },
    ]
};

const mockStudentAttemptData: StudentAttempt = {
    conceptName: 'Photosynthesis',
    questions: [
        'Explain photosynthesis in your own words.',
        'What happens if sunlight is not available?',
    ],
    studentAnswers: [
        'Photosynthesis is when plants make their own food. They use sunlight and water. It is green.',
        'If there is no sun, the plant will die because it cannot make food.',
    ],
    feedback: {
        understandingLevel: 'Partial',
        strength: 'You correctly identified that plants use sunlight to make food.',
        gap: 'The role of carbon dioxide was missing, and the explanation of the food-making process could be more detailed.',
        languageFeedback: {
            spelling: ['photosynthesis'],
            clarity: 'Try using shorter sentences to explain the steps.',
        },
        correctExplanation: 'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide from the air to create their own food (sugar/glucose) for energy, releasing oxygen as a byproduct.',
    }
};

const getUnderstandingBadge = (level: UnderstandingLevel) => {
    switch (level) {
        case 'Strong':
            return <Badge className="bg-success/20 text-success-foreground hover:bg-success/30">Strong</Badge>;
        case 'Weak':
            return <Badge variant="destructive" className="bg-destructive/20 text-destructive-foreground hover:bg-destructive/30">Weak</Badge>;
        case 'Partial':
        default:
            return <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/30">Partial</Badge>;
    }
}

export default function TeacherStudentOverviewPage() {
    useProtectedRoute('teacher');
    const searchParams = useSearchParams();
    const params = useParams();
    const studentId = params.id as string;
    const conceptId = searchParams.get('concept');

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
            // To test error: setError("Failed to load student profile.");
            setStudent(mockStudentProfileData);
            setLoading(false);
        }, 1000);
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
                <Link href="/teacher/dashboard?tab=students">
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
                        <div className="p-4 bg-background rounded-lg">
                            <p className="text-3xl font-bold text-green-600">{student.snapshot.strongConcepts}</p>
                            <p className="text-sm text-muted-foreground">Strong Concepts</p>
                        </div>
                        <div className="p-4 bg-background rounded-lg">
                            <p className="text-3xl font-bold text-yellow-600">{student.snapshot.needsWork}</p>
                            <p className="text-sm text-muted-foreground">Needs Work</p>
                        </div>
                        <div className="p-4 bg-background rounded-lg col-span-1 md:col-span-3 text-left">
                            <p className="font-semibold">Repeated Issue</p>
                            <p className="text-sm text-muted-foreground">{student.snapshot.repeatedIssue}</p>
                        </div>
                    </CardContent>
                </Card>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Concept Attempts</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="flex flex-col gap-3">
                            {student.recentConcepts.map(concept => (
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
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StudentConceptFeedbackView({ studentId, conceptId }: { studentId: string, conceptId: string }) {
  const [attempt, setAttempt] = useState<StudentAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const student = mockStudentProfileData; // In a real app, you might fetch this too

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      // To test error: setError("Failed to load attempt.");
      setAttempt(mockStudentAttemptData);
      setLoading(false);
    }, 1000);
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
  
  if (!attempt) {
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
  const showLanguageFeedback = featureFlags.ENABLE_LANGUAGE_FEEDBACK && attempt.feedback.languageFeedback;

  return (
    <div className="container mx-auto max-w-4xl py-6 sm:py-8">
      <div className="flex justify-between items-center mb-4">
        <Button asChild variant="outline" size="sm">
            <Link href={`/teacher/student/${student.id}`}>
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
                <h1 className="text-2xl font-bold">{student.name} ({student.rollNumber})</h1>
                <p className="text-muted-foreground">{attempt.conceptName}</p>
            </div>
            <Badge variant="outline">Teacher View</Badge>
        </div>
      </header>

      <div className="space-y-6">
        
        <Card>
            <CardHeader>
                <CardTitle>Student's Submission</CardTitle>
                <CardDescription>The questions asked and the answers provided by the student for this concept.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {attempt.questions.map((question, index) => (
                    <div key={index}>
                        <p className="font-semibold text-primary">{question}</p>
                        <blockquote className="mt-2 border-l-2 pl-4 italic text-muted-foreground">
                            {attempt.studentAnswers[index]}
                        </blockquote>
                    </div>
                ))}
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

        {showLanguageFeedback && (attempt.feedback.languageFeedback?.spelling || attempt.feedback.languageFeedback?.clarity) && (
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base font-semibold">
                Expression Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0 text-sm text-muted-foreground">
              {attempt.feedback.languageFeedback.spelling && (
                <div className="flex items-start gap-3">
                  <Pencil className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Spelling: Check the spelling of &quot;
                    {attempt.feedback.languageFeedback.spelling.join(', ')}&quot;.
                  </p>
                </div>
              )}
              {attempt.feedback.languageFeedback.clarity && (
                <div className="flex items-start gap-3">
                  <Puzzle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Sentence clarity: {attempt.feedback.languageFeedback.clarity}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
