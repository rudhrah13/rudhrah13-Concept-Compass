import { adminConceptDifficultyData, adminTrendsData } from '@/lib/mock-data';
import { ConceptDifficultyChart, TrendsChart } from './charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Administrator Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2">High-level school-wide learning analytics.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart className="w-6 h-6"/>
                Concept Difficulty Across Classes
            </CardTitle>
            <CardDescription>
              Highlights which concepts are most challenging for students in different classes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConceptDifficultyChart data={adminConceptDifficultyData} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <LineChart className="w-6 h-6"/>
                Understanding Trends Over Time
            </CardTitle>
            <CardDescription>
              Tracks the average student understanding month-over-month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendsChart data={adminTrendsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
