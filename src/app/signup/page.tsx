'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Compass, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd handle account creation here.
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
            <CardTitle>Create Student Account</CardTitle>
            <CardDescription>Fill in your details to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID / Roll Number</Label>
                <Input id="studentId" placeholder="e.g., S101" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select required>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
