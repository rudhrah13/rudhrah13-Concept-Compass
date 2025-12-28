'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Compass } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd handle account creation here.
    // For this prototype, we just navigate.
    router.push('/student/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-8 gap-2 text-primary">
          <Compass className="w-8 h-8" />
          <span className="text-2xl font-bold">Concept Compass</span>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Create Student Account</CardTitle>
            <CardDescription>Fill in your details to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            {isMounted && (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
