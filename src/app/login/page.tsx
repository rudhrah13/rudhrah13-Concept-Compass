'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initializeDemoData, getStudents } from '@/lib/demo-data';
import type { DemoStudent } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [students, setStudents] = useState<DemoStudent[]>([]);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    initializeDemoData();
    setStudents(getStudents());
  }, []);

  const handleStudentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Find student in our demo data, ignoring case for the name
    const student = students.find(s => s.studentId.toLowerCase() === studentId.toLowerCase() && s.name.toLowerCase() === studentName.toLowerCase());

    if (student) {
        localStorage.setItem('role', 'student');
        localStorage.setItem('studentId', student.studentId);
        localStorage.setItem('studentName', student.name);
        router.push('/student/dashboard');
    } else {
        alert('Student not found. Please check your Name and ID.');
    }
  };

  const handleTeacherSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('role', 'teacher');
    router.push('/teacher/dashboard');
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden items-center justify-center bg-primary/5 lg:flex">
         <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C3D9FF,transparent)]"></div>
        </div>
        <div className="text-center p-8 space-y-4">
            <Compass className="w-24 h-24 text-primary mx-auto" />
            <h2 className="text-3xl font-bold text-primary">This is not an exam.</h2>
            <p className="text-muted-foreground text-lg">Just explain what you understand. It's okay to make mistakes.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 min-h-screen">
          <div className="w-full max-w-md">
            <Link href="/" className="flex items-center justify-center mb-6 gap-2 text-primary">
                <Compass className="w-8 h-8" />
                <span className="text-2xl font-bold">Concept Compass</span>
            </Link>
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>Check understanding early. This is not an exam.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="student" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="teacher">Teacher</TabsTrigger>
                  </TabsList>
                    <TabsContent value="student">
                      <form onSubmit={handleStudentSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="studentName">Student Name</Label>
                          <Input id="studentName" name="studentName" placeholder="e.g., Aarav" required value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="studentId">Student ID / Roll Number</Label>
                          <Input id="studentId" name="studentId" placeholder="e.g., S001" required value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Sign In as Student</Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="teacher">
                      <form onSubmit={handleTeacherSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="teacherId">Email or Teacher ID</Label>
                          <Input id="teacherId" placeholder="e.g., teacher@school.edu" required defaultValue="teacher@school.edu" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" type="password" required defaultValue="password" />
                        </div>
                        <Button type="submit" className="w-full">Sign In as Teacher</Button>
                      </form>
                    </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}