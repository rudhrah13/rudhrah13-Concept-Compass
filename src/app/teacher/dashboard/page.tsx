import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherDashboard() {
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-bold tracking-tight font-headline">Teacher Dashboard</h1>
            <p className="text-lg text-muted-foreground mt-2">Class performance at a glance.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">The teacher dashboard is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
