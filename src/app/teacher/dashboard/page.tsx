'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ConceptData = {
  name: string;
  understanding: {
    strong: number;
    partial: number;
    weak: number;
  };
  misconceptions: string[];
  revisionFocus: string;
};

const dummyConcepts: ConceptData[] = [
  {
    name: 'Photosynthesis',
    understanding: { strong: 25, partial: 60, weak: 15 },
    misconceptions: ['Students think plants get food from the soil.', 'Confusing chlorophyll with chloroplasts.'],
    revisionFocus: 'Emphasize that plants create their own food and the specific roles of different cell parts.',
  },
  {
    name: 'Respiration',
    understanding: { strong: 20, partial: 45, weak: 35 },
    misconceptions: ['Believing respiration is the same as breathing.', 'Not understanding it occurs in all living cells.'],
    revisionFocus: 'Clarify the difference between breathing (gas exchange) and cellular respiration (energy release).',
  },
  {
    name: 'Light Reflection',
    understanding: { strong: 75, partial: 20, weak: 5 },
    misconceptions: ['Thinking surfaces must be shiny to reflect light.'],
    revisionFocus: 'Use examples of diffuse reflection from non-shiny surfaces to illustrate the concept.',
  },
];

const getUnderstandingBadge = (concept: ConceptData) => {
    const { strong, partial, weak } = concept.understanding;
    if (strong > 65) return <Badge className="bg-success/20 text-success-foreground hover:bg-success/30">Strong</Badge>
    if (weak > 30) return <Badge variant="destructive" className="bg-destructive/20 text-destructive-foreground hover:bg-destructive/30">Weak</Badge>
    return <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/30">Partial</Badge>
}

const getUnderstandingText = (concept: ConceptData) => {
    const { strong, partial, weak } = concept.understanding;
    if (strong > 65) return `${strong}% Strong`;
    if (weak > 30) return `${weak}% Weak`;
    return `${partial}% Partial`;
}


export default function TeacherDashboard() {
  const [selectedConcept, setSelectedConcept] = useState<ConceptData | null>(null);

  return (
    <div className="container py-10">
      <Button asChild variant="outline" className="mb-4">
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
      </Button>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Class Understanding Overview</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Class: <strong>8A</strong></span>
          <span>Subject: <strong>Science</strong></span>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Concept Performance</CardTitle>
          <CardDescription>Click on a concept to view common misconceptions and revision suggestions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concept Name</TableHead>
                <TableHead>Understanding Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyConcepts.map((concept) => (
                <TableRow
                  key={concept.name}
                  className="cursor-pointer"
                  onClick={() => setSelectedConcept(concept)}
                >
                  <TableCell className="font-medium">{concept.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {getUnderstandingBadge(concept)}
                        <span className="text-muted-foreground text-sm">{getUnderstandingText(concept)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedConcept} onOpenChange={() => setSelectedConcept(null)}>
        <DialogContent className="sm:max-w-[480px]">
          {selectedConcept && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedConcept.name}: Insights</DialogTitle>
                <DialogDescription>
                  Common issues and suggestions for the class.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                    <h4 className="font-semibold text-destructive">Common Misconceptions</h4>
                    <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-muted-foreground">
                        {selectedConcept.misconceptions.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold text-primary flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Suggested Revision Focus</h4>
                    <p className="text-sm text-muted-foreground">{selectedConcept.revisionFocus}</p>
                </div>
              </div>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
