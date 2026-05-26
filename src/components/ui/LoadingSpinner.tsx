import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-3',
  };

  return (
    <div className={cn('flex items-center justify-center w-full py-12', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-t-[#C9A86C] border-neutral-200',
          sizes[size]
        )}
      />
    </div>
  );
}
