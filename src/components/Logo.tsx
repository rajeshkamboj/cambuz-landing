import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2.5 group ${className}`}
      aria-label="Cambuz PDF Reader home"
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface border border-border-default group-hover:border-primary/50 transition-colors duration-200">
        <FileText className="w-5 h-5 text-primary" strokeWidth={2} />
      </span>
      <span className="text-lg font-semibold tracking-tight text-text-main group-hover:text-white transition-colors">
        Cambuz
      </span>
    </Link>
  );
}
