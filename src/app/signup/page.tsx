'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Compass } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd handle account creation here.
    // For this prototype, we just navigate.
    router.push('/student/dashboard');
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
       <div className="relative hidden items-center justify-center bg-primary/5 lg:flex">
         <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C3D9FF,transparent)]"></div>
        </div>
        <div className="text-center p-8 space-y-4">
            <Compass className="w-24 h-24 text-primary mx-auto" />
            <h2 className="text-3xl font-bold text-primary">A new way to check understanding.</h2>
            <p className="text-muted-foreground text-lg">Create an account to start your learning journey.</p>
        </div>
      </div>
       <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="w-full max-w-md">
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
                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="underline">
                        Sign in
                    </Link>
                </div>
                </form>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}