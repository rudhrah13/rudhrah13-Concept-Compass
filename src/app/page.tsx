'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { login } from '@/lib/auth/actions';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/types';
import { GraduationCap, School, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <header className="flex flex-col items-center justify-center gap-2 mb-8">
          <AppLogo className="w-16 h-16 text-primary-foreground fill-primary" />
          <h1 className="text-3xl font-bold tracking-tight font-headline">Concept Compass</h1>
          <p className="text-muted-foreground">Navigate your learning journey.</p>
        </header>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-center">Select your role to sign in</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginTabs />
          </CardContent>
        </Card>
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          {year && <p>&copy; {year} Concept Compass. All rights reserved.</p>}
        </footer>
      </div>
    </main>
  );
}

function LoginTabs() {
  const [activeTab, setActiveTab] = useState<UserRole>('student');

  return (
    <Tabs defaultValue="student" onValueChange={(value) => setActiveTab(value as UserRole)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="student"><GraduationCap className="w-4 h-4 mr-2"/>Student</TabsTrigger>
        <TabsTrigger value="teacher"><School className="w-4 h-4 mr-2"/>Teacher</TabsTrigger>
        <TabsTrigger value="admin"><ShieldCheck className="w-4 h-4 mr-2"/>Admin</TabsTrigger>
      </TabsList>
      <TabsContent value="student"><LoginForm role="student" /></TabsContent>
      <TabsContent value="teacher"><LoginForm role="teacher" /></TabsContent>
      <TabsContent value="admin"><LoginForm role="admin" /></TabsContent>
    </Tabs>
  );
}

function LoginForm({ role }: { role: UserRole }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const idLabel = role === 'student' ? 'Student ID / Roll Number' : `${role.charAt(0).toUpperCase() + role.slice(1)} ID`;
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result.success) {
      toast({
        title: "Login Successful",
        description: `Welcome! Redirecting to your dashboard...`,
      });
      router.push(`/${result.user?.role}/dashboard`);
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.error,
      });
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <input type="hidden" name="role" value={role} />
      <div className="space-y-2">
        <Label htmlFor={`${role}-id`}>{idLabel}</Label>
        <Input id={`${role}-id`} name="id" placeholder={`Enter your ${idLabel}`} required />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
}
