'use client';

import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Check,
  X,
  Lightbulb,
  ArrowLeft,
  ThumbsUp,
  AlertTriangle,
  BookOpen,
  Pencil,
  Puzzle,
  ChevronRight,
  User,
  Activity,
  Target,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type UnderstandingLevel = 'Strong' | 'Partial' | 'Weak';

const mockStudentProfileData = {
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
        { id: 'photosynthesis', name: 'Photosynthesis', status: 'Partial' as UnderstandingLevel, date: '2 days ago' },
        { id: 'respiration', name: 'Respiration', status: 'Weak' as UnderstandingLevel, date: '5 days ago' },
        { id: 'light-reflection', name: 'Light Reflection', status: 'Strong' as UnderstandingLevel, date: '1 week ago' },
    ]
};

const mockStudentAttemptData = {
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
        conceptUnderstanding: 'Partial' as UnderstandingLevel,
        conceptFeedback: {
            strength: 'You correctly identified that plants use sunlight to make food.',
            gap: 'The role of carbon dioxide was missing, and the explanation of the food-making process could be more detailed.',
        },
        languageFeedback: {
            spelling: ['photosynthesis'],
            clarity: 'Try using shorter sentences to explain the steps.',
        },
        correctExplanation: 'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide from the air to create their own food (sugar/glucose) for energy, releasing oxygen as a byproduct.',
    }
};


const getUnderstandingSummary = (level: UnderstandingLevel) => {
  switch (level) {
    case 'Strong':
      return { icon: <Check className="h-5 w-5 text-green-500" />, text: 'Strong Understanding' };
    case 'Partial':
      return { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, text: 'Partial Understanding' };
    case 'Weak':
    default:
      return { icon: <X className="h-5 w-5 text-red-500" />, text: 'Weak Understanding' };
  }
};

const getUnderstandingBadge = (level: 'Strong' | 'Partial' | 'Weak') => {
    switch (level) {
        case 'Strong':
            return <Badge className="bg-success/20 text-success-foreground hover:bg-success/30">Strong</Badge>
        case 'Weak':
            return <Badge variant="destructive" className="bg-destructive/20 text-destructive-foreground hover:bg-destructive/30">Weak</Badge>
        case 'Partial':
        default:
            return <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/30">Partial</Badge>
    }
}

export default function TeacherStudentOverviewPage() {
    const searchParams = useSearchParams();
    const params = useParams();
    const studentId = params.id as string;
    const conceptId = searchParams.get('concept');

    const student = mockStudentProfileData;

    if (conceptId) {
        return <StudentConceptFeedbackView student={student} conceptId={conceptId} />;
    }

    return (
        <div className="container mx-auto max-w-4xl py-6 sm:py-8">
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link href="/teacher/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>
            </Button>

            <header className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{student.name} ({student.rollNumber})</h1>
                        <p className="text-muted-foreground">Student Profile</p>
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
                            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" />Repeated Patterns</CardTitle>
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
                                <Link key={concept.id} href={`/teacher/student/${studentId}?concept=${concept.id}`} className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors">
                                    <div>
                                        <p className="font-medium">{concept.name}</p>
                                        <p className="text-sm text-muted-foreground">{concept.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {getUnderstandingBadge(concept.status)}
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
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


function StudentConceptFeedbackView({ student, conceptId }: { student: typeof mockStudentProfileData, conceptId: string }) {
  const attempt = mockStudentAttemptData;
  const summary = getUnderstandingSummary(attempt.feedback.conceptUnderstanding);

  return (
    <div className="container mx-auto max-w-4xl py-6 sm:py-8">
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link href={`/teacher/student/${student.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Student Profile
        </Link>
      </Button>

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
                <CardDescription>The questions asked and the answers provided by the student.</CardDescription>
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
              <span className="font-semibold text-lg">{summary.text}</span>
            </div>
            {getUnderstandingBadge(attempt.feedback.conceptUnderstanding)}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {attempt.feedback.conceptFeedback.strength && (
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
                  <span>{attempt.feedback.conceptFeedback.strength}</span>
                </p>
              </CardContent>
            </Card>
          )}
          {attempt.feedback.conceptFeedback.gap && (
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
                  <span>{attempt.feedback.conceptFeedback.gap}</span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {(attempt.feedback.languageFeedback.spelling ||
          attempt.feedback.languageFeedback.clarity) && (
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
              <AccordionTrigger className="flex w-full items-center justify-between p-4 text-base font-semibold text-primary hover:no-underline">
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
    