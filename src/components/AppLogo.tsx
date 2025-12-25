import { Compass } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppLogo({ className, ...props }: LucideProps) {
  return (
    <div className={cn("p-2 rounded-full bg-primary/20", className)}>
        <Compass
        className="text-primary-foreground fill-primary"
        {...props}
        />
    </div>
  );
}
