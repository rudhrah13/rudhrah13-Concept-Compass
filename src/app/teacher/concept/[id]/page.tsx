'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Lightbulb, Users, FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Progress } from '@/components/ui/progress';


type StudentAttempt = {
    id: string;
    name: string;
    rollNumber: string;
    understanding: 'Strong' | 'Partial' | 'Weak';
    keyIssue: string;
};

const dummyConceptData = {
    id: 'photosynthesis',
    name: 'Photosynthesis',
    distribution: { strong: 5, partial: 12, weak: 3 },
    keyGaps: [
        'Missed steps of food preparation process.',
        'Confused the roles of sunlight and heat.',
        'Difficulty explaining the concept in their own words.',
    ],
    suggestedActions: [
        'Re-explain the process using a visual diagram on the board.',
        'Ask students to explain the concept aloud to a partner.',
        'Use the real-life example of a houseplant needing sunlight.',
    ]
};

const dummyStudentAttempts: StudentAttempt[] = [
    { id: '1', name: 'Anonymized Student 1', rollNumber: 'S101', understanding: 'Partial', keyIssue: 'Incomplete food steps' },
    { id: '2', name: 'Anonymized Student 2', rollNumber: 'S102', understanding: 'Strong', keyIssue: 'None' },
    { id: '3', name: 'Anonymized Student 3', rollNumber: 'S103', understanding: 'Weak', keyIssue: 'Role of CO2 missing' },
    { id: '4', name: 'Anonymized Student 4', rollNumber: 'S104', understanding: 'Partial', keyIssue: 'Confused sunlight/heat' },
];

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

export default function ConceptOverviewPage({ params }: { params: { id: string } }) {
  const concept = dummyConceptData;
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
          <span>Class: <strong>8A</strong></span>
          <span>Subject: <strong>Science</strong></span>
        </div>
      </header>

      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Understanding Distribution</CardTitle>
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
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />Key Gaps Identified</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        {concept.keyGaps.map((gap, i) => <li key={i}>{gap}</li>)}
                    </ul>
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
                <CardTitle>Student Submissions</CardTitle>
                <CardDescription>Review individual student answers and the feedback they received.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Understanding</TableHead>
                             <TableHead>Key Issue</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummyStudentAttempts.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/teacher/student/${student.id}`} className="hover:underline">
                                        {student.name} ({student.rollNumber})
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {getUnderstandingBadge(student.understanding)}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {student.keyIssue}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
    