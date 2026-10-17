interface SearchStep {
  title: string;
  description: string;
}

/** Numbered how-to list: a ringed number next to a title and a one-line hint. */
export function SearchSteps({ steps }: { steps: SearchStep[] }) {
  return (
    <ol className="flex flex-col gap-5">
      {steps.map(({ title, description }, index) => (
        <li key={title} className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border font-mono text-sm text-text-secondary"
          >
            {index + 1}
          </span>
          <div className="flex flex-col">
            <span className="text-base text-text-secondary">{title}</span>
            <span className="text-sm text-text-tertiary">{description}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
