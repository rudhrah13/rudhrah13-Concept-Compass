import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Concept Compass',
  description: 'Understand concepts clearly, before exams.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-background" suppressHydrationWarning>
      <body className={`${inter.className} antialiased h-full`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
