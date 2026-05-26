import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  href,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-all duration-300 rounded-none tracking-wider uppercase focus:outline-none';

  const variants = {
    primary: 'bg-[#1A1A1A] text-white hover:bg-neutral-800 border border-transparent',
    secondary: 'bg-white text-[#1A1A1A] hover:bg-neutral-100 border border-transparent',
    gold: 'bg-[#C9A86C] text-[#1A1A1A] hover:bg-[#b0915a] hover:text-white border border-transparent shadow-lg shadow-yellow-600/10',
    outline: 'bg-transparent text-white border border-white hover:bg-white hover:text-[#1A1A1A]',
    ghost: 'bg-transparent text-[#1A1A1A] hover:bg-neutral-100 border border-transparent',
    glass: 'bg-black/30 backdrop-blur-md text-white border border-white/20 hover:bg-white/10 hover:border-white/30',
  };

  const sizes = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-sm px-6 py-3 gap-2.5',
    lg: 'text-base px-8 py-4 gap-3',
  };

  const buttonClasses = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}
