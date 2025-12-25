'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/AppLogo';
import { login } from '@/lib/auth/actions';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const autoLogin = async () => {
      // The form data is now optional in the login action
      await login(new FormData());
      // After login action sets the cookie, refresh the page
      // so the middleware can correctly redirect.
      router.refresh();
    };

    // Use a timeout to ensure the UI renders before login attempt,
    // which can help in some race condition scenarios.
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
