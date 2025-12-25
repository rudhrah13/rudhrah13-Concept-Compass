import Link from 'next/link';
import { teacherDashboardData, concepts, subjects } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChartHorizontal, Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TeacherDashboard() {
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-bold tracking-tight font-headline">Teacher Dashboard</h1>
            <p className="text-lg text-muted-foreground mt-2">Class performance at a glance.</p>
        </div>
        <div className="flex gap-4">
            <Select defaultValue="10">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="9">Class 9</SelectItem>
                </SelectContent>
            </Select>
            <Select defaultValue="A">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {teacherDashboardData.map(stat => {
          const concept = concepts.find(c => c.id === stat.conceptId);
          if (!concept) return null;
          const subject = subjects.find(s => s.id === concept.subjectId);
          return (
            <Card key={stat.conceptId} className="hover:shadow-lg transition-shadow">
                <Link href={`/teacher/concept/${concept.id}`} className="block">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">{concept.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    {subject && <subject.icon className="w-4 h-4 text-muted-foreground"/>}
                                    {subject?.name}
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="hidden md:flex">
                                <Eye className="w-4 h-4 mr-2"/>
                                View Details
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <BarChartHorizontal className="w-4 h-4"/>
                            Class Understanding
                        </h3>
                        <div className="space-y-2">
                            <UnderstandingBar label="Strong" value={stat.understanding.strong} color="bg-green-500" />
                            <UnderstandingBar label="Partial" value={stat.understanding.partial} color="bg-yellow-500" />
                            <UnderstandingBar label="Weak" value={stat.understanding.weak} color="bg-red-500" />
                        </div>
                        </div>
                        <div>
                        <h3 className="text-sm font-semibold mb-2">Common Misconceptions</h3>
                        <div className="flex flex-wrap gap-2">
                            {stat.commonMisconceptions.map((mc, i) => (
                            <Badge key={i} variant="secondary">{mc}</Badge>
                            ))}
                        </div>
                        </div>
                    </CardContent>
                </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function UnderstandingBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-20 text-sm text-muted-foreground">{label}</span>
      <Progress value={value} indicatorClassName={color} className="h-2 flex-1" />
      <span className="text-sm font-medium">{value}%</span>
    </div>
  );
}
