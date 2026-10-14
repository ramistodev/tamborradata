import type { ReactNode } from 'react';

type BigStatProps = {
  value: ReactNode;
  children: ReactNode;
  className?: string;
};

export function BigStat({ value, children, className = '' }: BigStatProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:gap-5 ${className}`}>
      <p className="text-6xl font-bold text-accent md:text-9xl">{value}</p>
      <p className="w-full text-base text-text-secondary sm:text-lg md:w-110 md:text-xl">
        {children}
      </p>
    </div>
  );
}

export function StatHighlight({ children }: { children: ReactNode }) {
  return <span className="font-bold text-text">{children}</span>;
}
