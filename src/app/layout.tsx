import type {Metadata} from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from '@/components/ui/scroll-to-top';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

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
      <body className={`${ptSans.variable} font-sans antialiased h-full`}>
          <ScrollToTop />
          {children}
        <Toaster />
      </body>
    </html>
  );
}
