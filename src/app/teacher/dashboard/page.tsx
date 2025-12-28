// page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ConceptPerformance, Student, UnderstandingLevel } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';

// Server action to log to terminal
async function logStudentClick(student: Student) {

  console.log('=== STUDENT CLICKED ===');
  console.log('ID:', student.id);
  console.log('Name:', student.name);
  console.log('Roll Number:', student.rollNumber);
  console.log('Timestamp:', new Date().toISOString());
  console.log('========================');
}


const dummyConcepts: ConceptPerformance[] = [
  {
    id: 'photosynthesis',
    name: 'Photosynthesis',
    understanding: { strong: 25, partial: 60, weak: 15 },
  },
  {
    id: 'respiration',
    name: 'Respiration',
    understanding: { strong: 20, partial: 45, weak: 35 },
  },
  {
    id: 'light-reflection',
    name: 'Light Reflection',
    understanding: { strong: 75, partial: 20, weak: 5 },
  },
];

const dummyStudents: Student[] = [
    { id: '1', name: 'Anonymized Student 1', rollNumber: 'S101'},
    { id: '2', name: 'Anonymized Student 2', rollNumber: 'S102'},
    { id: '3', name: 'Anonymized Student 3', rollNumber: 'S103'},
    { id: '4', name: 'Anonymized Student 4', rollNumber: 'S104'},
    { id: '5', name: 'Anonymized Student 5', rollNumber: 'S105'},
];

export default function TeacherDashboard() {
  useProtectedRoute('teacher');

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
          <span>Class: <strong>8A</strong></span>
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

function ConceptList() {
    const [concepts, setConcepts] = useState<ConceptPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // To test error: setError("Failed to load concepts.");
            setConcepts(dummyConcepts);
            setLoading(false);
        }, 1000);
    };

    useEffect(fetchData, []);

    const getUnderstandingText = (concept: ConceptPerformance) => {
        const { strong, partial, weak } = concept.understanding;
        if (strong > 65) return `${strong}% Strong`;
        if (weak > 30) return `${weak}% Weak`;
        return `${partial}% Partial`;
    }

    const getUnderstandingBadgeForConcept = (concept: ConceptPerformance) => {
        const { strong, weak } = concept.understanding;
        if (strong > 65) return <Badge className="bg-success/20 text-success-foreground hover:bg-success/30">Strong</Badge>;
        if (weak > 30) return <Badge variant="destructive" className="bg-destructive/20 text-destructive-foreground hover:bg-destructive/30">Weak</Badge>;
        return <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/30">Partial</Badge>;
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
            return <div className="text-center p-10 text-muted-foreground">No concepts have been attempted yet.</div>;
        }
        return (
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concept Name</TableHead>
                    <TableHead>Class Understanding</TableHead>
                    <TableHead className="text-right sr-only">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
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
            <CardContent>
              {renderContent()}
            </CardContent>
        </>
    );
}

function StudentList() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // To test error: setError("Failed to load students.");
            setStudents(dummyStudents);
            setLoading(false);
        }, 1000);
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
                         <Link 
                           href={`/teacher/student/${student.id}`} 
                           className="flex items-center p-4 h-full"
                           onClick={() => {
                             console.log('Clicked on student:', {
                               id: student.id,
                               name: student.name,
                               rollNumber: student.rollNumber
                             });
                             // Also log to terminal via server action
                             logStudentClick(student);
                           }}
                         >
                            {student.name}
                        </Link>
                      </TableCell>
                      <TableCell className="p-0">
                        <Link 
                          href={`/teacher/student/${student.id}`} 
                          className="flex items-center p-4 h-full"
                          onClick={() => {
                            console.log('Clicked on student:', {
                              id: student.id,
                              name: student.name,
                              rollNumber: student.rollNumber
                            });
                            logStudentClick(student);
                          }}
                        >
                            {student.rollNumber}
                        </Link>
                      </TableCell>
                       <TableCell className="text-right p-0">
                        <Link 
                          href={`/teacher/student/${student.id}`} 
                          className="flex items-center justify-end p-4 h-full"
                          onClick={() => {
                            console.log('Clicked on student:', {
                              id: student.id,
                              name: student.name,
                              rollNumber: student.rollNumber
                            });
                            logStudentClick(student);
                          }}
                        >
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
            <CardContent>
              {renderContent()}
            </CardContent>
        </>
    );
}
