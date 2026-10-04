import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title?: ReactNode;
  description?: ReactNode;
  /** Slot aligned to the right of the title (filters, links, ...). */
  action?: ReactNode;
  /** Heading level of the title, to keep the page outline correct. */
  headingAs?: 'h2' | 'h3' | 'h4';
  tone?: 'default' | 'accent';
};

const tones = {
  default: 'border-border',
  accent: 'border-accent bg-[image:linear-gradient(150deg,var(--accent-glow),transparent_70%)]',
};

export function Card({
  title,
  description,
  action,
  headingAs: Heading = 'h3',
  tone = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <section
      className={`rounded-[14px] border bg-card p-5 sm:px-5.5 ${tones[tone]} ${className}`}
      {...props}
    >
      {(title || action) && (
        <header
          className={`flex items-start justify-between gap-3 ${description ? 'mb-1' : 'mb-3.5'}`}
        >
          <Heading className="text-[13.5px] leading-[1.3] font-semibold tracking-[-0.01em] text-text">
            {title}
          </Heading>
          {action}
        </header>
      )}
      {description && (
        <p className="mb-4 text-[11.5px] leading-normal text-text-tertiary">{description}</p>
      )}
      {children}
    </section>
  );
}
