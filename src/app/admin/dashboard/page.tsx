import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="container py-10">
      <Button asChild variant="outline" className="mb-4">
        <Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Login</Link>
      </Button>
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
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
