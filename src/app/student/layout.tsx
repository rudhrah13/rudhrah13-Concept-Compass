import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
            <Link href="/student/dashboard" className="flex items-center space-x-2 text-primary">
              <Compass className="w-6 h-6" />
              <span className="font-bold">Concept Compass</span>
            </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
