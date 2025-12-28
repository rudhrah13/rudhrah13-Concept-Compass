'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, FlaskConical, Lightbulb, Loader2, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ConceptOverview, UnderstandingLevel, DemoConcept, DemoEvaluation, DemoStudent } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { getConcepts, getEvaluations, getStudents, initializeDemoData } from '@/lib/demo-data';


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

export default function ConceptOverviewPage() {
  const params = useParams();
  const id = params.id as string; // conceptId
  useProtectedRoute('teacher');
  const [concept, setConcept] = useState<ConceptOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    initializeDemoData();

    setTimeout(() => {
      try {
        const conceptData: DemoConcept | undefined = getConcepts().find(c => c.conceptId === id);
        if (!conceptData) {
            setError("Concept not found.");
            setLoading(false);
            return;
        }

        const allEvaluations: DemoEvaluation[] = getEvaluations();
        const evaluationsForConcept = allEvaluations.filter(e => e.conceptId === id);
        const allStudents: DemoStudent[] = getStudents();

        const gapCounts: { [key: string]: number } = {};
        evaluationsForConcept.forEach(e => {
            if (e.evaluation.gap && e.evaluation.gap !== 'None') {
                gapCounts[e.evaluation.gap] = (gapCounts[e.evaluation.gap] || 0) + 1;
            }
        });

        const sortedGaps = Object.keys(gapCounts).sort((a, b) => gapCounts[b] - gapCounts[a]);
        
        const overview: ConceptOverview = {
            id: conceptData.conceptId,
            name: conceptData.chapter,
            distribution: {
                strong: evaluationsForConcept.filter(e => e.evaluation.understanding === 'Strong').length,
                partial: evaluationsForConcept.filter(e => e.evaluation.understanding === 'Partial').length,
                weak: evaluationsForConcept.filter(e => e.evaluation.understanding === 'Weak').length,
            },
            keyGaps: sortedGaps.slice(0, 3), // Show top 3 common gaps
            suggestedActions: [ // This can be made dynamic later
                'Re-explain the process using a visual diagram on the board.',
                'Ask students to explain the concept aloud to a partner.',
                'Use the real-life example of a houseplant needing sunlight.',
            ],
            studentAttempts: evaluationsForConcept.map(e => {
                const student = allStudents.find(s => s.studentId === e.studentId);
                return {
                    studentId: e.studentId,
                    studentName: student?.name || 'Unknown Student',
                    rollNumber: student?.studentId || 'N/A',
                    understanding: e.evaluation.understanding,
                    keyIssue: e.evaluation.gap,
                };
            }),
        };
        
        setConcept(overview);
      } catch(e) {
          setError("Failed to load concept overview.");
      } finally {
        setLoading(false);
      }
    }, 500); // Reduced delay
  };

  useEffect(() => {
    fetchData()
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> Loading concept overview...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchData}>Try Again</Button>
      </div>
    );
  }
  
  if (!concept) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Concept data not found.</p>
        <Button asChild variant="link"><Link href="/teacher/dashboard">Back to Dashboard</Link></Button>
      </div>
    );
  }

  const totalStudents = concept.distribution.strong + concept.distribution.partial + concept.distribution.weak;

  return (
    <div className="container py-10">
      <Button asChild variant="outline" className="mb-4">
        <Link href="/teacher/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview</Link>
      </Button>

      <header className="mb-6">
         <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link href="/teacher/dashboard">Class Overview</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{concept.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-4xl font-bold mb-2">Concept Overview: {concept.name}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Class: <strong>5A</strong></span>
          <span>Subject: <strong>Science</strong></span>
        </div>
      </header>

      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Understanding Distribution</CardTitle>
                <CardDescription>Counts of student understanding levels for this concept.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                    <DistributionPill label="Strong" count={concept.distribution.strong} total={totalStudents} color="bg-green-500" />
                    <DistributionPill label="Partial" count={concept.distribution.partial} total={totalStudents} color="bg-yellow-500" />
                    <DistributionPill label="Weak" count={concept.distribution.weak} total={totalStudents} color="bg-red-500" />
                </div>
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />Most common confusions</CardTitle>
                </CardHeader>
                <CardContent>
                    {concept.keyGaps.length > 0 ? (
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            {concept.keyGaps.map((gap, i) => <li key={i}>{gap}</li>)}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">No common gaps identified yet.</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FlaskConical className="h-5 w-5" />Suggested Classroom Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        {concept.suggestedActions.map((action, i) => <li key={i}>{action}</li>)}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Student Submissions for this Concept</CardTitle>
                <CardDescription>Review individual student answers and the feedback they received for this specific concept.</CardDescription>
            </CardHeader>
            <CardContent>
                {concept.studentAttempts.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Understanding</TableHead>
                                <TableHead>Key Issue</TableHead>
                                <TableHead className="text-right sr-only">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {concept.studentAttempts.map((student) => (
                                <TableRow key={student.studentId} className="group">
                                    <TableCell className="font-medium p-0">
                                        <Link href={`/teacher/student/${student.studentId}?fromConcept=${concept.id}`} className="flex items-center p-4 h-full">
                                            {student.studentName} ({student.rollNumber})
                                        </Link>
                                    </TableCell>
                                    <TableCell className="p-0">
                                        <Link href={`/teacher/student/${student.studentId}?fromConcept=${concept.id}`} className="flex items-center p-4 h-full">
                                            {getUnderstandingBadge(student.understanding)}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground p-0">
                                        <Link href={`/teacher/student/${student.studentId}?fromConcept=${concept.id}`} className="flex items-center p-4 h-full">
                                            {student.keyIssue}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right p-0">
                                        <Link href={`/teacher/student/${student.studentId}?fromConcept=${concept.id}`} className="flex items-center justify-end p-4 h-full">
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        No student responses yet for this concept.
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DistributionPill({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
                <span className="font-medium">{label}</span>
                <span>{count} / {total} Students</span>
            </div>
            <Progress value={percentage} indicatorClassName={color} />
        </div>
    );
}
