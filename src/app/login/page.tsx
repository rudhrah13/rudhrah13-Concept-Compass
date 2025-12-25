'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Compass, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd handle authentication here.
    // For this prototype, we just navigate.
    router.push('/student/dashboard');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background">
      <Button asChild variant="outline" className="absolute top-4 left-4">
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
      </Button>
      <div className="w-full max-w-md p-4">
        <Link href="/" className="flex items-center justify-center mb-8 gap-2 text-primary">
            <Compass className="w-8 h-8" />
            <span className="text-2xl font-bold">Concept Compass</span>
        </Link>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Student Login</CardTitle>
            <CardDescription>Enter your Student ID to sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID / Roll Number</Label>
                <Input id="studentId" placeholder="e.g., S101" required />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Sign In</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
