import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Administrator Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2">High-level school-wide learning analytics.</p>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">The admin dashboard is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
