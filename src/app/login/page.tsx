'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Compass, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Role = 'student' | 'teacher';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('student');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (role === 'student') {
      router.push('/student/dashboard');
    } else {
      router.push('/teacher/dashboard');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background">
      <Button asChild variant="outline" className="absolute top-4 left-4">
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
      </Button>
      <div className="w-full max-w-md p-4">
        <Link href="/" className="flex items-center justify-center mb-6 gap-2 text-primary">
            <Compass className="w-8 h-8" />
            <span className="text-2xl font-bold">Concept Compass</span>
        </Link>
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Concept Compass</CardTitle>
            <CardDescription>Check understanding early. This is not an exam.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(value) => setRole(value as Role)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
              </TabsList>
              <form onSubmit={handleSubmit}>
                <TabsContent value="student" className="space-y-4">
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="studentId">Student ID / Roll Number</Label>
                    <Input id="studentId" placeholder="e.g., S101" required />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Sign In as Student</Button>
                </TabsContent>
                <TabsContent value="teacher" className="space-y-4">
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="teacherId">Email or Teacher ID</Label>
                    <Input id="teacherId" placeholder="e.g., teacher@school.edu" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">Sign In as Teacher</Button>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
