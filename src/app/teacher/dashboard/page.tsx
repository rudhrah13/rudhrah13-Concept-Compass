'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ConceptPerformance, Student as StudentType, DemoStudent, DemoConcept, DemoEvaluation } from '@/types';
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
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
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
        if (strong >= 65) return `${Math.round(strong)}% Strong`;
        if (weak > 30) return `${Math.round(weak)}% Weak`;
        if (strong + partial + weak === 0) return 'Not Attempted';
        return `${Math.round(partial + weak)}% Needs Work`;
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
                    <TableHead>Concept</TableHead>
                    <TableHead>Class Understanding</TableHead>
                    <TableHead className="text-right sr-only">Actions</TableHead>
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
                                    <Link href={`/teacher/concept/${concept.id}`} className="flex items-center p-4 h-full">
                                        <div className="flex items-center gap-2">
                                            {getUnderstandingBadgeForConcept(concept)}
                                            <span className="text-muted-foreground text-sm">{getUnderstandingText(concept)}</span>
                                        </div>
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
              <CardDescription>Click on a concept to drill down into student-level understanding.</CardDescription>
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
                const transformedStudents = studentData.map(s => ({
                    id: s.studentId,
                    name: s.name,
                    rollNumber: s.studentId,
                }));
                setStudents(transformedStudents);
            } catch (e) => {
                setError("Failed to load students.");
            } finally {
                setLoading(false);
            }
        }, 500);
    };

    useEffect(fetchData, []);

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
                    <TableHead>Student Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead className="text-right sr-only">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="group">
                      <TableCell className="font-medium p-0">
                         <Link href={`/teacher/student/${student.id}`} className="flex items-center p-4 h-full">
                            {student.name}
                        </Link>
                      </TableCell>
                      <TableCell className="p-0">
                        <Link href={`/teacher/student/${student.id}`} className="flex items-center p-4 h-full">
                            {student.rollNumber}
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
              <CardDescription>Click on a student to view their overall performance profile.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {renderContent()}
            </CardContent>
        </>
    );
}
