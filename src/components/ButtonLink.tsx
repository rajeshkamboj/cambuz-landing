import { Link } from 'react-router-dom';
import { Download, ArrowRight } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonLinkProps {
  to: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: 'download' | 'arrow' | 'none';
  external?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30',
  secondary:
    'bg-surface text-text-main border border-border-default hover:border-border-hover hover:bg-surface-2',
  ghost: 'text-text-secondary hover:text-text-main hover:bg-surface/50',
};

const sizeStyles: Record<Size, string> = {
  sm: 'text-sm px-4 py-2 rounded-lg gap-1.5',
  md: 'text-sm px-5 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-7 py-3.5 rounded-xl gap-2.5',
};

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon = 'none',
  external = false,
}: ButtonLinkProps) {
  const base = `inline-flex items-center justify-center font-medium transition-all duration-200 ease-smooth ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const iconEl =
    icon === 'download' ? (
      <Download className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
    ) : icon === 'arrow' ? (
      <ArrowRight className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
    ) : null;

  if (external) {
    return (
      <a href={to} className={base} target="_blank" rel="noopener noreferrer">
        {iconEl}
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={base}>
      {iconEl}
      {children}
    </Link>
  );
}
