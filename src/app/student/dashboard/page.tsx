'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock Data
const subjects = [
  { id: 'science', name: 'Science' },
  { id: 'math', name: 'Mathematics' },
];

const concepts = {
  science: [
    { id: 'sci1', name: 'Photosynthesis', status: 'Feedback Available' },
    { id: 'sci2', name: 'Respiration', status: 'Not Started' },
    { id: 'sci3', name: 'Light Reflection', status: 'In Progress' },
    { id: 'sci4', name: 'Acids & Bases', status: 'Feedback Available' },
    { id: 'sci5', name: 'Newton\'s Laws', status: 'Not Started' },
  ],
  math: [
    { id: 'math1', name: 'Pythagorean Theorem', status: 'In Progress' },
    { id: 'math2', name: 'Quadratic Equations', status: 'Not Started' },
    { id: 'math3', name: 'Linear Functions', status: 'Feedback Available' },
    { id: 'math4', name: 'Circles', status: 'Not Started' },
  ],
};

type ConceptStatus = 'Not Started' | 'In Progress' | 'Feedback Available';

const getStatusStyles = (status: ConceptStatus) => {
  switch (status) {
    case 'Feedback Available':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Not Started':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getButtonAction = (status: ConceptStatus) => {
  switch (status) {
    case 'Feedback Available':
      return 'View Feedback';
    case 'In Progress':
      return 'Continue';
    case 'Not Started':
    default:
      return 'Start';
  }
};

export default function StudentDashboard() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary">Select what you are working on today</h1>
      </header>

      <Tabs defaultValue="science" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          {subjects.map(subject => (
            <TabsTrigger key={subject.id} value={subject.id}>
              {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="science">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {concepts.science.map(concept => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="math">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {concepts.math.map(concept => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConceptCard({ concept }: { concept: { id: string, name: string, status: ConceptStatus } }) {
  const getHref = () => {
    if (concept.status === 'Feedback Available') {
      return `/student/feedback/${concept.id}`;
    }
    return `/student/concept/${concept.id}`;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{concept.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <Badge className={getStatusStyles(concept.status)}>{concept.status}</Badge>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent hover:bg-accent/90">
          <Link href={getHref()}>{getButtonAction(concept.status)}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
