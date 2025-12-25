'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/AppLogo';
import { login } from '@/lib/auth/actions';

export default function LoginPage() {

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
            <CardTitle className="text-center text-2xl">Student Login</CardTitle>
            <CardDescription className="text-center">Click the button below to sign in as a student.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-6">
             <form action={login}>
                <input type="hidden" name="role" value="student" />
                <input type="hidden" name="id" value="S101" />
                <button type="submit" className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 transition-colors">
                    Sign in as Student
                </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
