import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-forest disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-forest text-cream hover:bg-forest-dark shadow-sm hover:shadow-md',
    secondary: 'bg-cream text-forest border border-sage hover:bg-sage-light',
    ghost: 'text-forest hover:bg-cream',
    danger: 'bg-terracotta text-white hover:bg-terracotta-dark',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white rounded-2xl shadow-soft border border-sage/20 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Badge({ color, children, className = '' }: { color?: string; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
      style={{ backgroundColor: color ? `${color}20` : undefined, color: color ?? undefined }}
    >
      {children}
    </span>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-sage border-t-forest ${className}`} style={{ width: '1em', height: '1em' }} role="status" aria-label="Loading" />
  );
}

export function EmptyState({ icon, title, message }: { icon?: React.ReactNode; title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-sage mb-4 text-4xl">{icon}</div>}
      <h3 className="font-display text-lg text-charcoal mb-1">{title}</h3>
      <p className="text-sm text-charcoal/60 max-w-xs">{message}</p>
    </div>
  );
}

export function SmartImage({ src, alt, className, fallbackClassName }: { src: string; alt: string; className?: string; fallbackClassName?: string }) {
  const [error, setError] = React.useState(false);
  if (error) {
    return (
      <div className={`bg-gradient-to-br from-forest to-sage ${fallbackClassName ?? className}`} aria-label={alt} role="img" />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
    />
  );
}
