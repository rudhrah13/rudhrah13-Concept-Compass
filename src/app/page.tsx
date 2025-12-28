import Link from 'next/link';
import { Compass, Lightbulb, Mic, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center text-center py-20 md:py-32 lg:py-40">
          <div className="container px-4">
            <Compass className="w-20 h-20 text-primary mx-auto mb-4" />
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

        <section className="py-16 bg-muted/50">
            <div className="container px-4">
                <h2 className="text-3xl font-bold text-center mb-8">How it helps</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <Card>
                        <CardContent className="p-6">
                            <Mic className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Explain by Speaking</h3>
                            <p className="text-muted-foreground">Use your voice to explain concepts naturally, just like in a classroom.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Know What You Know</h3>
                            <p className="text-muted-foreground">Get instant, private feedback to see what you've mastered and where you can improve.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Help Teachers Help You</h3>
                            <p className="text-muted-foreground">Provide teachers with insights on common gaps, so they know what to focus on in class.</p>
                        </CardContent>
                    </Card>
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
