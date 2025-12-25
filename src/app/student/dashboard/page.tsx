'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { subjects, concepts } from '@/lib/mock-data';
import type { Concept, Subject } from '@/types';
import { BrainCircuit } from 'lucide-react';

export default function StudentDashboard() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const router = useRouter();

  const availableConcepts = selectedSubjectId
    ? concepts.filter((c) => c.subjectId === selectedSubjectId)
    : [];

  const handleStart = () => {
    if (selectedConceptId) {
      router.push(`/student/concept/${selectedConceptId}`);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight font-headline">Explore a Concept</h1>
            <p className="text-lg text-muted-foreground mt-2">Choose a subject and concept to test your understanding.</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="w-6 h-6"/>
                Selection
            </CardTitle>
            <CardDescription>Pick a subject first, then a concept from the list.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select onValueChange={(value) => {
                setSelectedSubjectId(value);
                setSelectedConceptId(null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject: Subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center gap-2">
                        <subject.icon className="w-4 h-4" />
                        <span>{subject.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Concept</label>
              <Select 
                onValueChange={setSelectedConceptId} 
                disabled={!selectedSubjectId} 
                value={selectedConceptId || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedSubjectId ? "Select a concept" : "Please select a subject first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableConcepts.map((concept: Concept) => (
                    <SelectItem key={concept.id} value={concept.id}>
                      {concept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleStart} disabled={!selectedConceptId} className="w-full">
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
