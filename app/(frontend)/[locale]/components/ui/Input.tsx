import type { ComponentProps } from 'react';

/** Look shared by text fields and the select trigger, so they line up in a form row. */
export const fieldStyles =
  'w-full rounded-lg bg-bg px-4 py-3 font-sans text-base transition-colors duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Border and keyboard focus of a field. The idle border reaches 3:1 against the surface (WCAG
 * 1.4.11), and the focus is an accent border plus a 1px ring. The transparent outline only shows
 * in forced-colors mode, where box shadows are dropped.
 */
export const fieldBorderStyles =
  'border border-text-tertiary/75 hover:border-text-secondary outline-hidden focus-visible:border-accent focus-visible:ring-0 focus-visible:ring-accent focus-visible:outline-hidden!';

export function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={`${fieldStyles} ${fieldBorderStyles} text-text placeholder:text-text-tertiary ${className}`}
      {...props}
    />
  );
}
