'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/AppLogo';
import { login } from '@/lib/auth/actions';
import { users } from '@/lib/mock-data';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const autoLogin = async () => {
      const studentUser = users.find(u => u.role === 'student');
      if (studentUser) {
        const formData = new FormData();
        formData.append('role', studentUser.role);
        formData.append('id', studentUser.id);
        const result = await login(formData);
        
        if (result.success && result.user) {
          // Directly push to the dashboard.
          // The middleware will still validate the cookie on this navigation.
          router.push(`/${result.user.role}/dashboard`);
        }
      }
    };

    // Give the UI a moment to render before initiating the login and redirect.
    const timer = setTimeout(autoLogin, 100);

    return () => clearTimeout(timer);
  }, [router]);

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
            <CardTitle className="text-center text-2xl">Authenticating</CardTitle>
            <CardDescription className="text-center">Please wait while we sign you in...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
