'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { subjects, concepts, getStudentAttempts } from '@/lib/mock-data';
import type { Concept, Subject, Attempt } from '@/types';
import { getAuthenticatedUser } from '@/lib/auth/actions';

export default function StudentDashboard() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(subjects[0]?.id || null);
  const router = useRouter();

  // In a real app, you would get the studentId from the session.
  const studentId = 'S101'; 
  const studentAttempts = getStudentAttempts(studentId);

  const availableConcepts = selectedSubjectId
    ? concepts.filter((c) => c.subjectId === selectedSubjectId)
    : [];

  const getAttemptForConcept = (conceptId: string): Attempt | undefined => {
    return studentAttempts.find(a => a.conceptId === conceptId);
  }
  
  const getBadgeVariant = (status: Attempt['status']) => {
    switch (status) {
      case 'Feedback Available': return 'default';
      case 'In Progress': return 'secondary';
      case 'Not Started': return 'outline';
      default: return 'outline';
    }
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Select what you are working on today</h1>
        </div>

        <div className="space-y-4 mb-8">
            <label className="text-sm font-medium text-muted-foreground">Subject</label>
            <Select 
                onValueChange={(value) => setSelectedSubjectId(value)}
                defaultValue={selectedSubjectId || undefined}
            >
            <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
                {subjects.map((subject: Subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableConcepts.map((concept) => {
                const attempt = getAttemptForConcept(concept.id);
                return (
                    <Card 
                        key={concept.id} 
                        className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
                        onClick={() => router.push(attempt?.status === 'Feedback Available' ? `/student/feedback/${attempt.evaluationId}` : `/student/concept/${concept.id}`)}
                    >
                        <CardHeader>
                            <CardTitle className="text-lg">{concept.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           {attempt && <Badge variant={getBadgeVariant(attempt.status)}>{attempt.status}</Badge>}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
      </div>
    </div>
  );
}
