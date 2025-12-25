import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
          <Compass className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-5xl font-bold text-primary">Concept Compass</h1>
        <p className="text-xl text-muted-foreground">
          Understand concepts clearly, before exams.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Student Login</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/signup">Student Signup</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
