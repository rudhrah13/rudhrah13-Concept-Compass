'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { Concept, Chapter, ConceptStatus, DemoConcept, DemoEvaluation } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { getConcepts, getEvaluations, initializeDemoData } from '@/lib/demo-data';


const getStatusStyles = (status: ConceptStatus) => {
  switch (status) {
    case 'Feedback Available':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
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
  useProtectedRoute('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyNeedingAttention, setShowOnlyNeedingAttention] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize and load data from localStorage
    initializeDemoData();
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
        setError("Student not found. Please log in again.");
        setLoading(false);
        return;
    }

    try {
        const allConcepts: DemoConcept[] = getConcepts();
        const allEvaluations: DemoEvaluation[] = getEvaluations();
        const studentEvaluations = allEvaluations.filter(e => e.studentId === studentId);

        const conceptsWithStatus: Concept[] = allConcepts.map(c => {
            const evaluation = studentEvaluations.find(e => e.conceptId === c.conceptId);
            let status: ConceptStatus = 'Not Started';
            if (evaluation) {
                // This logic can be more complex, e.g., if there's an `in-progress` state
                status = 'Feedback Available';
            }
            return {
                id: c.conceptId,
                name: c.conceptName,
                status: status,
                questions: [] // Not needed for this view
            };
        });

        // Group concepts by chapter
        const chaptersMap: { [key: string]: Chapter } = {};
        allConcepts.forEach(concept => {
            if (!chaptersMap[concept.chapter]) {
                chaptersMap[concept.chapter] = {
                    id: concept.chapter.toLowerCase().replace(/\s/g, '-'),
                    title: concept.chapter,
                    icon: '🧪', // Assign a default or dynamic icon
                    concepts: [],
                };
            }
            const conceptWithStatus = conceptsWithStatus.find(cws => cws.id === concept.conceptId);
            if (conceptWithStatus) {
                chaptersMap[concept.chapter].concepts.push(conceptWithStatus);
            }
        });
        
        // A more realistic grouping of icons based on subject matter.
        const chapterIcons: { [key: string]: string } = {
            'Plants': '🌿',
            'Water': '💧',
            'Animals & Human Body': '🐾',
            'Materials & Changes': '🧪',
            'Energy, Light & Sound': '⚡',
            'Earth, Water & Environment': '🌍'
        };

        Object.values(chaptersMap).forEach(chapter => {
            const firstConcept = getConcepts().find(c => c.chapter === chapter.title);
            if(firstConcept?.subject === 'Science') {
                chapter.icon = chapterIcons[chapter.title] || '🧪';
            }
        });


        setChapters(Object.values(chaptersMap));
        setLoading(false);
    } catch (e) {
        setError("Failed to load concepts.");
        setLoading(false);
    }
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // You might want to re-run the useEffect logic here
  };

  const filteredChapters = chapters.map(chapter => {
    const filteredConcepts = chapter.concepts.filter(concept => {
      const matchesSearch = concept.name.toLowerCase().includes(searchQuery.toLowerCase()) || chapter.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = !showOnlyNeedingAttention || (concept.status === 'Not Started' || concept.status === 'In Progress');
      return matchesSearch && matchesFilter;
    });
    return { ...chapter, concepts: filteredConcepts };
  }).filter(chapter => chapter.concepts.length > 0);


  return (
    <div className="container mx-auto py-8">
       <Button asChild variant="outline" className="mb-4">
        <Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Login</Link>
      </Button>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary">Select what you are working on today</h1>
        <p className="text-muted-foreground mt-2">Choose a concept from the chapters below to get started.</p>
      </header>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
            <Input
            type="text"
            placeholder="Search a concept (e.g. photosynthesis, water cycle)"
            className="flex-grow"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="flex items-center space-x-2">
                <Checkbox 
                    id="needs-attention" 
                    checked={showOnlyNeedingAttention}
                    onCheckedChange={(checked) => setShowOnlyNeedingAttention(checked as boolean)}
                />
                <Label htmlFor="needs-attention" className="text-sm font-medium text-muted-foreground cursor-pointer">
                    Show only concepts needing attention
                </Label>
            </div>
        </div>

        {loading ? (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading concepts...</span>
            </div>
        ) : error ? (
            <div className="text-center py-10">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={handleRetry}>Try Again</Button>
            </div>
        ) : chapters.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No concepts have been assigned yet.</p>
            </div>
        ) : (
            <Accordion type="single" collapsible className="w-full space-y-2" defaultValue={filteredChapters[0]?.id}>
            {filteredChapters.map(chapter => (
                <AccordionItem value={chapter.id} key={chapter.id} className="border-b-0 rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-4">
                    <span className="text-2xl">{chapter.icon}</span>
                    {chapter.title}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                    <div className="flex flex-col gap-3">
                    {chapter.concepts.map(concept => (
                        <ConceptRow key={concept.id} concept={concept} />
                    ))}
                    </div>
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        )}
        {!loading && !error && chapters.length > 0 && filteredChapters.length === 0 && (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No concepts found. Try adjusting your search or filter.</p>
            </div>
        )}
      </div>
    </div>
  );
}

function ConceptRow({ concept }: { concept: Concept }) {
  const getHref = () => {
    if (concept.status === 'Feedback Available') {
      return `/student/feedback/${concept.id}`;
    }
    return `/student/concept/${concept.id}`;
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors">
        <div>
            <span className="font-medium text-foreground">{concept.name}</span>
        </div>
        <div className="flex items-center gap-4">
            <Badge variant="outline" className={`font-semibold ${getStatusStyles(concept.status)}`}>{concept.status}</Badge>
            <Button asChild variant="outline" size="sm">
            <Link href={getHref()}>{getButtonAction(concept.status)}</Link>
            </Button>
        </div>
    </div>
  );
}
