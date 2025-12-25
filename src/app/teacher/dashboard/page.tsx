import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherDashboard() {
  return (
    <div className="container py-10">
        <h1 className="text-4xl font-bold mb-4">Teacher Dashboard</h1>
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
