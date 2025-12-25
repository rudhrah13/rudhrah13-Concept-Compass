'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type ConceptData = {
  name: string;
  understanding: {
    strong: number;
    partial: number;
    weak: number;
  };
  studentCount: number;
};

type StudentAttempt = {
    id: string;
    name: string;
    rollNumber: string;
    understanding: 'Strong' | 'Partial' | 'Weak';
};

const dummyConcepts: ConceptData[] = [
  {
    name: 'Photosynthesis',
    understanding: { strong: 25, partial: 60, weak: 15 },
    studentCount: 3,
  },
  {
    name: 'Respiration',
    understanding: { strong: 20, partial: 45, weak: 35 },
    studentCount: 3,
  },
  {
    name: 'Light Reflection',
    understanding: { strong: 75, partial: 20, weak: 5 },
    studentCount: 2,
  },
];

const dummyStudentAttempts: { [conceptName: string]: StudentAttempt[] } = {
    Photosynthesis: [
        { id: '1', name: 'Anonymized Student 1', rollNumber: 'S101', understanding: 'Partial' },
        { id: '2', name: 'Anonymized Student 2', rollNumber: 'S102', understanding: 'Strong' },
        { id: '3', name: 'Anonymized Student 3', rollNumber: 'S103', understanding: 'Weak' },
    ],
    Respiration: [
        { id: '4', name: 'Anonymized Student 4', rollNumber: 'S104', understanding: 'Weak' },
        { id: '5', name: 'Anonymized Student 5', rollNumber: 'S105', understanding: 'Partial' },
        { id: '6', name: 'Anonymized Student 6', rollNumber: 'S106', understanding: 'Partial' },
    ],
    'Light Reflection': [
        { id: '7', name: 'Anonymized Student 7', rollNumber: 'S107', understanding: 'Strong' },
        { id: '8', name: 'Anonymized Student 8', rollNumber: 'S108', understanding: 'Strong' },
    ],
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

export default function TeacherDashboard() {
  const [selectedConcept, setSelectedConcept] = useState<ConceptData | null>(null);

  const handleConceptClick = (concept: ConceptData) => {
    setSelectedConcept(concept);
  };

  const handleBackToConcepts = () => {
    setSelectedConcept(null);
  }

  return (
    <div className="container py-10">
      <Button asChild variant="outline" className="mb-4">
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
      </Button>

      <header className="mb-6">
         <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <button onClick={handleBackToConcepts} className="text-muted-foreground hover:text-foreground disabled:text-muted-foreground disabled:hover:text-muted-foreground" disabled={!selectedConcept}>Class Overview</button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {selectedConcept && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedConcept.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-4xl font-bold mb-2">
            {selectedConcept ? `Student Understanding for ${selectedConcept.name}` : "Class Understanding Overview"}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Class: <strong>8A</strong></span>
          <span>Subject: <strong>Science</strong></span>
        </div>
      </header>

      <Card>
        {!selectedConcept ? (
            <ConceptList onConceptClick={handleConceptClick} />
        ) : (
            <StudentAttemptList concept={selectedConcept} />
        )}
      </Card>
    </div>
  );
}

function ConceptList({ onConceptClick }: { onConceptClick: (concept: ConceptData) => void }) {
    const getUnderstandingText = (concept: ConceptData) => {
        const { strong, partial, weak } = concept.understanding;
        if (strong > 65) return `${strong}% Strong`;
        if (weak > 30) return `${weak}% Weak`;
        return `${partial}% Partial`;
    }

    const getUnderstandingBadgeForConcept = (concept: ConceptData) => {
        const { strong, partial, weak } = concept.understanding;
        if (strong > 65) return <Badge className="bg-success/20 text-success-foreground hover:bg-success/30">Strong</Badge>
        if (weak > 30) return <Badge variant="destructive" className="bg-destructive/20 text-destructive-foreground hover:bg-destructive/30">Weak</Badge>
        return <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/30">Partial</Badge>
    }

    return (
        <>
            <CardHeader>
              <CardTitle>Concept Performance</CardTitle>
              <CardDescription>Click on a concept to drill down into student-level understanding.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concept Name</TableHead>
                    <TableHead>Class Understanding</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyConcepts.map((concept) => (
                    <TableRow
                      key={concept.name}
                      className="cursor-pointer"
                      onClick={() => onConceptClick(concept)}
                    >
                      <TableCell className="font-medium">{concept.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                            {getUnderstandingBadgeForConcept(concept)}
                            <span className="text-muted-foreground text-sm">{getUnderstandingText(concept)}</span>
                        </div>
                      </TableCell>
                       <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
        </>
    );
}

function StudentAttemptList({ concept }: { concept: ConceptData }) {
    const students = dummyStudentAttempts[concept.name] || [];

    return (
        <>
            <CardHeader>
                <CardTitle>Student Submissions</CardTitle>
                <CardDescription>Review individual student answers and the feedback they received.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Understanding</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/teacher/student/${student.id}?concept=${encodeURIComponent(concept.name)}`} className="hover:underline">
                                        {student.name} ({student.rollNumber})
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {getUnderstandingBadge(student.understanding)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/teacher/student/${student.id}?concept=${encodeURIComponent(concept.name)}`}>View Feedback</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </>
    );
}
