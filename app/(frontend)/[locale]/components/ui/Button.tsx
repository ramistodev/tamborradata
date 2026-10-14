import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost';
type Size = 'sm' | 'md';

type ButtonStyleOptions = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

// `aria-disabled` is for buttons that must stay focusable (a native `disabled` one drops out of the
// tab order and loses focus); it looks like `disabled`, and its handler has to ignore the click.
const base =
  'inline-flex items-center justify-center gap-2 rounded-lg border font-sans tracking-[-0.01em] ' +
  'cursor-pointer transition-[opacity,transform,color,border-color] duration-200 motion-reduce:transition-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    'border-transparent bg-accent text-bg font-bold hover:not-aria-disabled:-translate-y-px hover:not-aria-disabled:opacity-85 ' +
    'motion-reduce:hover:translate-y-0 disabled:hover:translate-y-0 disabled:hover:opacity-50',
  ghost:
    'border-border bg-transparent text-text font-medium hover:not-aria-disabled:border-accent hover:not-aria-disabled:text-accent',
};

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-[13px]',
  md: 'px-[21px] py-[11px] text-sm',
};

/** Button classes, exposed so links (`<Link>`, `<a>`) can look like buttons. */
export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonStyleOptions = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Omit<ButtonStyleOptions, 'className'>;

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
