import Link from 'next/link';
import { Compass, Lightbulb, Mic, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5e5ff,transparent)]"></div>
          </div>
          <div className="container z-10 px-4">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
              <Compass className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Concept Compass</h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
              Understand concepts clearly, before exams.
            </p>
            <div className="flex justify-center gap-4 pt-6">
              <Button asChild size="lg">
                <Link href="/login">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
            <div className="container px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center p-4">
                        <div className="p-3 bg-primary/10 rounded-full mb-3">
                            <Mic className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Explain by Speaking</h3>
                        <p className="text-muted-foreground text-sm">Use your voice to explain concepts naturally, just like in a classroom.</p>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <div className="p-3 bg-primary/10 rounded-full mb-3">
                            <Lightbulb className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Know What You Know</h3>
                        <p className="text-muted-foreground text-sm">Get instant, private feedback to see what you've mastered and where you can improve.</p>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <div className="p-3 bg-primary/10 rounded-full mb-3">
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Help Teachers Help You</h3>
                        <p className="text-muted-foreground text-sm">Provide teachers with insights on common gaps, so they know what to focus on in class.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

       <footer className="py-6 bg-background border-t">
        <div className="container flex justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Concept Compass. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Concept Compass</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
