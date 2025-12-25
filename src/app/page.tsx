import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5e5ff,transparent)]"></div>
      </div>
      <div className="text-center space-y-4 z-10">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
          <Compass className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-5xl font-bold text-primary">Concept Compass</h1>
        <p className="text-xl text-muted-foreground">
          Understand concepts clearly, before exams.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/signup">Signup</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
