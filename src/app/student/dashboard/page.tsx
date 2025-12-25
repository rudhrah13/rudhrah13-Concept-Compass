'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Sigma } from 'lucide-react';

// Mock Data
const subjects = [
  { id: 'science', name: 'Science', icon: <BookOpen /> },
  { id: 'math', name: 'Mathematics', icon: <Sigma /> },
];

const concepts = {
  science: [
    { id: 'sci1', name: 'Photosynthesis', status: 'Feedback Available' },
    { id: 'sci2', name: 'Respiration', status: 'Not Started' },
    { id: 'sci3', name: 'Light Reflection', status: 'In Progress' },
    { id: 'sci4', name: 'Acids & Bases', status: 'Feedback Available' },
  ],
  math: [
    { id: 'math1', name: 'Pythagorean Theorem', status: 'In Progress' },
    { id: 'math2', name: 'Quadratic Equations', status: 'Not Started' },
    { id: 'math3', name: 'Linear Functions', status: 'Feedback Available' },
  ],
};

type ConceptStatus = 'Not Started' | 'In Progress' | 'Feedback Available';

const getStatusStyles = (status: ConceptStatus) => {
  switch (status) {
    case 'Feedback Available':
      return 'bg-success/10 text-success border-success/20';
    case 'In Progress':
      return 'bg-warning/10 text-warning-foreground border-warning/20';
    case 'Not Started':
    default:
      return 'bg-muted text-muted-foreground border-border';
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
        <p className="text-muted-foreground mt-2">Choose a subject and a concept to get started.</p>
      </header>

      <Tabs defaultValue="science" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          {subjects.map(subject => (
            <TabsTrigger key={subject.id} value={subject.id} className="gap-2">
              {subject.icon}
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
    <Card className="flex flex-col transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>{concept.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <Badge variant="outline" className={getStatusStyles(concept.status)}>{concept.status}</Badge>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={getHref()}>{getButtonAction(concept.status)}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
