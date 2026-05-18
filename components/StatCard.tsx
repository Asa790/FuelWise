import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  color?: 'teal' | 'orange' | 'default';
  icon?: ReactNode;
}

export default function StatCard({ label, value, unit, color = 'default', icon }: StatCardProps) {
  const colorClass =
    color === 'teal'
      ? 'text-brand-teal'
      : color === 'orange'
      ? 'text-brand-orange'
      : 'text-text-primary';

  return (
    <div className="card-surface flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-text-muted">
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <div className={`text-2xl font-bold leading-tight ${colorClass}`}>
        {value}
        {unit && <span className="text-sm font-medium ml-1 opacity-80">{unit}</span>}
      </div>
    </div>
  );
}
