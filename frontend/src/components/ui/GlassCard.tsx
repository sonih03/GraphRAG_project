import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className, glow = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-md bg-zinc-900/70 border border-zinc-800/80 rounded-xl shadow-2xl transition-all duration-300',
        glow && 'border-cyan-500/30 shadow-cyan-950/40 hover:border-cyan-500/50',
        className
      )}
    >
      {children}
    </div>
  );
}
