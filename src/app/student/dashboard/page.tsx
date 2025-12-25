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
import type { Concept, Chapter, ConceptStatus } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';


const mockChapters: Chapter[] = [
  {
    id: 'chapter1',
    title: 'Plants & Life Processes',
    icon: '🌿',
    concepts: [
      { id: 'sci1', name: 'Photosynthesis', status: 'Feedback Available' },
      { id: 'sci2', name: 'Role of sunlight, water, air', status: 'Not Started' },
      { id: 'sci3', name: 'Respiration in plants', status: 'In Progress' },
      { id: 'sci4', name: 'Seed germination', status: 'Not Started' },
    ],
  },
  {
    id: 'chapter2',
    title: 'Animals & Human Body',
    icon: '🐾',
    concepts: [
      { id: 'sci5', name: 'Digestive system', status: 'Feedback Available' },
      { id: 'sci6', name: 'Breathing vs respiration', status: 'Not Started' },
      { id: 'sci7', name: 'Circulatory system', status: 'In Progress' },
      { id: 'sci8', name: 'Animal adaptations', status: 'Not Started' },
    ],
  },
  {
    id: 'chapter3',
    title: 'Materials & Changes',
    icon: '🧪',
    concepts: [
      { id: 'sci9', name: 'States of matter', status: 'Feedback Available' },
      { id: 'sci10', name: 'Reversible vs irreversible changes', status: 'Not Started' },
      { id: 'sci11', name: 'Properties of materials', status: 'In Progress' },
    ],
  },
  {
    id: 'chapter4',
    title: 'Energy, Light & Sound',
    icon: '⚡',
    concepts: [
      { id: 'sci12', name: 'Sources of energy', status: 'Not Started' },
      { id: 'sci13', name: 'Light and shadows', status: 'Feedback Available' },
      { id: 'sci14', name: 'Transparent / translucent / opaque', status: 'Not Started' },
      { id: 'sci15', name: 'Sound production', status: 'In Progress' },
    ],
  },
  {
    id: 'chapter5',
    title: 'Earth, Water & Environment',
    icon: '🌍',
    concepts: [
      { id: 'sci16', name: 'Water cycle', status: 'Feedback Available' },
      { id: 'sci17', name: 'Soil types and uses', status: 'Not Started' },
      { id: 'sci18', name: 'Natural resources', status: 'In Progress' },
      { id: 'sci19', name: 'Pollution and prevention', status: 'Not Started' },
    ],
  },
];


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
    // Simulate API call
    setTimeout(() => {
      // To test error state: setError("Failed to load concepts."); setLoading(false); return;
      setChapters(mockChapters);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Simulate refetch
     setTimeout(() => {
      setChapters(mockChapters);
      setLoading(false);
    }, 1000);
  };

  const filteredChapters = chapters.map(chapter => {
    const filteredConcepts = chapter.concepts.filter(concept => {
      const matchesSearch = concept.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = !showOnlyNeedingAttention || (concept.status === 'Not Started' || concept.status === 'In Progress');
      return matchesSearch && matchesFilter;
    });
    return { ...chapter, concepts: filteredConcepts };
  }).filter(chapter => chapter.concepts.length > 0);


  return (
    <div className="container mx-auto py-8">
       <Button asChild variant="outline" className="mb-4">
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
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
            <Accordion type="single" collapsible className="w-full space-y-2">
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
