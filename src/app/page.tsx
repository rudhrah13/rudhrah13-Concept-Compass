'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/AppLogo';
import { login } from '@/lib/auth/actions';
import { users } from '@/lib/mock-data';

export default function LoginPage() {

  // This form will auto-submit on page load to log the user in.
  useEffect(() => {
    const form = document.getElementById('login-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  }, []);

  const defaultStudent = users.find(u => u.role === 'student');

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

        {/* Hidden form for auto-login */}
        <form id="login-form" action={login} className="hidden">
            <input type="hidden" name="role" value={defaultStudent?.role || 'student'} />
            <input type="hidden" name="id" value={defaultStudent?.id || 'S101'} />
        </form>

      </div>
    </main>
  );
}
