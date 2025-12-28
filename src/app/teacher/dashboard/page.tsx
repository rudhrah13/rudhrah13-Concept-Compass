'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Loader2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ConceptPerformance, Student as StudentType, DemoStudent, DemoConcept, DemoEvaluation, StudentStatus } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { getStudents, getConcepts, getEvaluations, initializeDemoData } from '@/lib/demo-data';


export default function TeacherDashboard() {
  useProtectedRoute('teacher');

  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <div className="container py-10">
       <Button asChild variant="outline" className="mb-4">
        <Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Login</Link>
      </Button>

      <header className="mb-6">
         <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Class Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-4xl font-bold mb-2">Class Understanding Overview</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Class: <strong>5A</strong></span>
          <span>Subject: <strong>Science</strong></span>
        </div>
      </header>

      <Tabs defaultValue="concepts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="concepts">Concepts</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        <TabsContent value="concepts">
            <Card className="mt-4">
                <ConceptList />
            </Card>
        </TabsContent>
        <TabsContent value="students">
            <Card className="mt-4">
                <StudentList />
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const chapterIcons: { [key: string]: string } = {
    'Plants': '🌿',
    'Water': '💧',
    'Animals & Human Body': '🐾',
    'Materials & Changes': '🧪',
    'Energy, Light & Sound': '⚡',
    'Earth, Water & Environment': '🌍'
};

function ConceptList() {
    const [concepts, setConcepts] = useState<ConceptPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            try {
                const allConcepts: DemoConcept[] = getConcepts();
                const allEvaluations: DemoEvaluation[] = getEvaluations();
                
                const performanceData = allConcepts.map(concept => {
                    const evaluationsForConcept = allEvaluations.filter(e => e.conceptId === concept.conceptId);
                    const totalEvals = evaluationsForConcept.length;

                    const understanding = {
                        strong: totalEvals > 0 ? (evaluationsForConcept.filter(e => e.evaluation.understanding === 'Strong').length / totalEvals) * 100 : 0,
                        partial: totalEvals > 0 ? (evaluationsForConcept.filter(e => e.evaluation.understanding === 'Partial').length / totalEvals) * 100 : 0,
                        weak: totalEvals > 0 ? (evaluationsForConcept.filter(e => e.evaluation.understanding === 'Weak').length / totalEvals) * 100 : 0,
                    };

                    return {
                        id: concept.conceptId,
                        name: concept.conceptName,
                        chapter: concept.chapter,
                        understanding,
                    };
                });
                
                setConcepts(performanceData);
            } catch (e) {
                setError("Failed to load concepts.");
            } finally {
                setLoading(false);
            }
        }, 500);
    };

    useEffect(fetchData, []);

    const groupedConcepts = useMemo(() => {
        return concepts.reduce((acc, concept) => {
            (acc[concept.chapter] = acc[concept.chapter] || []).push(concept);
            return acc;
        }, {} as Record<string, ConceptPerformance[]>);
    }, [concepts]);

    const getUnderstandingText = (concept: ConceptPerformance) => {
        const { strong, partial, weak } = concept.understanding;
        if (strong + partial + weak === 0) return 'This concept hasn’t been checked yet';
        if (weak > 30) return 'Many students are struggling here';
        if (strong >= 65) return 'No immediate action needed';
        return 'Some students need review';
    }

    const getUnderstandingBadgeForConcept = (concept: ConceptPerformance) => {
        const { strong, weak, partial } = concept.understanding;
        if (strong + partial + weak === 0) return <Badge variant="outline">Not Attempted</Badge>;
        if (strong >= 65) return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Strong</Badge>;
        if (weak > 30) return <Badge variant="destructive" className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Weak</Badge>;
        return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Partial</Badge>;
    }

    const renderContent = () => {
        if (loading) {
            return <div className="flex items-center justify-center p-10"><Loader2 className="h-6 w-6 animate-spin" /> Loading concepts...</div>;
        }
        if (error) {
            return (
                <div className="text-center p-10">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={fetchData}>Try Again</Button>
                </div>
            );
        }
        if (concepts.length === 0) {
            return <div className="text-center p-10 text-muted-foreground">No concepts found.</div>;
        }
        return (
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Concept</TableHead>
                    <TableHead className="w-[50%]">Class Understanding</TableHead>
                    <TableHead className="text-right sr-only w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(groupedConcepts).map(([chapter, concepts]) => (
                    <React.Fragment key={chapter}>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableCell colSpan={3} className="font-bold text-foreground">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{chapterIcons[chapter] || '🧪'}</span>
                                    {chapter}
                                </div>
                            </TableCell>
                        </TableRow>
                        {concepts.map((concept) => (
                            <TableRow key={concept.id} className="group">
                                <TableCell className="font-medium p-0">
                                    <Link href={`/teacher/concept/${concept.id}`} className="flex items-center p-4 h-full">
                                        {concept.name}
                                    </Link>
                                </TableCell>
                                <TableCell className="p-0">
                                    <Link href={`/teacher/concept/${concept.id}`} className="flex flex-col items-start gap-1 p-4 h-full">
                                        {getUnderstandingBadgeForConcept(concept)}
                                        <span className="text-muted-foreground text-xs">{getUnderstandingText(concept)}</span>
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right p-0">
                                    <Link href={`/teacher/concept/${concept.id}`} className="flex items-center justify-end p-4 h-full">
                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
        );
    }

    return (
        <>
            <CardHeader>
              <CardTitle>Concept Performance</CardTitle>
              <CardDescription>Use this view to find concepts where many students are struggling.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {renderContent()}
            </CardContent>
        </>
    );
}

function StudentList() {
    const [students, setStudents] = useState<StudentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            try {
                const studentData: DemoStudent[] = getStudents();
                const allEvaluations: DemoEvaluation[] = getEvaluations();

                const transformedStudents = studentData.map(s => {
                    const studentEvals = allEvaluations.filter(e => e.studentId === s.studentId);
                    let status: StudentStatus;
                    
                    if (studentEvals.length === 0) {
                        status = 'Not yet evaluated';
                    } else {
                        const weakCount = studentEvals.filter(e => e.evaluation.understanding === 'Weak').length;
                        const partialCount = studentEvals.filter(e => e.evaluation.understanding === 'Partial').length;
                        if (weakCount > 1 || (weakCount === 1 && partialCount > 0)) {
                            status = 'Struggling';
                        } else if (weakCount === 1 || partialCount > 1) {
                            status = 'Needs attention';
                        } else {
                            status = 'Doing well';
                        }
                    }

                    return {
                        id: s.studentId,
                        name: s.name,
                        rollNumber: s.studentId,
                        status: status,
                    }
                }).sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));
                setStudents(transformedStudents);
            } catch (e) {
                setError("Failed to load students.");
            } finally {
                setLoading(false);
            }
        }, 500);
    };

    useEffect(fetchData, []);

     const getStatusIndicator = (status: StudentStatus) => {
        switch (status) {
            case 'Struggling':
                return <><Circle className="h-2.5 w-2.5 fill-red-500 text-red-500 mr-2" />Struggling</>;
            case 'Needs attention':
                return <><Circle className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500 mr-2" />Needs attention</>;
            case 'Doing well':
                return <><Circle className="h-2.5 w-2.5 fill-green-500 text-green-500 mr-2" />Doing well</>;
            case 'Not yet evaluated':
            default:
                return <><Circle className="h-2.5 w-2.5 fill-slate-400 text-slate-400 mr-2" />Not yet evaluated</>;
        }
    };


     const renderContent = () => {
        if (loading) {
            return <div className="flex items-center justify-center p-10"><Loader2 className="h-6 w-6 animate-spin" /> Loading students...</div>;
        }
        if (error) {
            return (
                <div className="text-center p-10">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={fetchData}>Try Again</Button>
                </div>
            );
        }
        if (students.length === 0) {
            return <div className="text-center p-10 text-muted-foreground">No students found.</div>;
        }
        return (
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Student Name</TableHead>
                    <TableHead className="w-[25%]">Roll Number</TableHead>
                    <TableHead className="w-[35%]">Overall Performance</TableHead>
                    <TableHead className="text-right sr-only w-[50px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="group">
                      <TableCell className="font-medium p-0">
                         <Link href={`/teacher/student/${student.id}`} className="flex items-center gap-2 p-4 h-full">
                            {student.name}
                        </Link>
                      </TableCell>
                      <TableCell className="p-0 text-muted-foreground">
                        <Link href={`/teacher/student/${student.id}`} className="flex items-center p-4 h-full">
                            {student.rollNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="p-0">
                         <Link href={`/teacher/student/${student.id}`} className="flex items-center p-4 h-full text-sm">
                           {getStatusIndicator(student.status)}
                        </Link>
                      </TableCell>
                       <TableCell className="text-right p-0">
                        <Link href={`/teacher/student/${student.id}`} className="flex items-center justify-end p-4 h-full">
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        );
     }

    return (
        <>
            <CardHeader>
              <CardTitle>Student Roster</CardTitle>
              <CardDescription>Use this view to understand individual student performance.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {renderContent()}
            </CardContent>
        </>
    );
}
