import { contactEmail } from '../../../../config/constants';

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-text-secondary leading-relaxed">{children}</p>;
}

export function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-text-secondary leading-relaxed marker:text-accent">
      {children}
    </ul>
  );
}

/** Tags and values the privacy policy messages can use with `t.rich`. */
export const rich = {
  strong: (chunks: React.ReactNode) => (
    <strong className="font-semibold text-text-primary">{chunks}</strong>
  ),
  code: (chunks: React.ReactNode) => <code className="font-mono text-text-primary">{chunks}</code>,
  mail: (chunks: React.ReactNode) => (
    <a
      href={`mailto:${contactEmail}`}
      className="text-accent underline underline-offset-4 hover:text-text-primary"
    >
      {chunks}
    </a>
  ),
  email: contactEmail,
};
