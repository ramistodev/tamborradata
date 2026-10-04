import type { HTMLAttributes } from 'react';

/** Centers content to the site's max width with fluid side gutters. */
export function Container({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mx-auto w-full max-w-275 px-[clamp(16px,4vw,56px)] ${className}`} {...props} />
  );
}
