import type { HTMLAttributes } from 'react';

/** Loading placeholder. Size it with `className` (e.g. `h-4 w-32`). */
export function Skeleton({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-bg-hover motion-reduce:animate-none ${className}`}
      {...props}
    />
  );
}
