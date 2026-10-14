'use client';
import { useId, useState } from 'react';
import { Icons } from '../Icons';

export type FAQItem = {
  question: string;
  answer: string;
};

type HeadingLevel = 'h2' | 'h3' | 'h4';

type FAQsProps = {
  items: FAQItem[];
  /** Level of the question headings. Pick the one that follows the heading above the list. */
  headingLevel?: HeadingLevel;
  className?: string;
};

export function FAQs({ items, headingLevel = 'h3', className = '' }: FAQsProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {items.map((item) => (
        <FAQEntry key={item.question} item={item} headingLevel={headingLevel} />
      ))}
    </div>
  );
}

function FAQEntry({ item, headingLevel }: { item: FAQItem; headingLevel: HeadingLevel }) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const buttonId = `${id}-question`;
  const panelId = `${id}-answer`;
  const Heading = headingLevel;

  return (
    // The keyboard focus is drawn on the whole card (accent border + 1px ring): an outline on the
    // button would be clipped by the card's overflow
    <div
      className={`overflow-hidden rounded-lg border bg-card transition-colors duration-200 motion-reduce:transition-none has-focus-visible:border-accent has-focus-visible:ring-1 has-focus-visible:ring-accent ${isOpen ? 'border-border-strong' : 'border-border hover:border-border-strong'}`}
    >
      <Heading>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-sans text-base font-semibold text-text outline-hidden transition-colors duration-200 motion-reduce:transition-none focus-visible:bg-bg-hover focus-visible:outline-hidden! sm:text-lg"
        >
          {item.question}
          <Icons.ChevronDown
            className={`size-4 text-text-secondary transition-transform duration-300 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </Heading>

      {/*
       * The row grows from 0fr to 1fr, so the answer pushes what is below it down smoothly, with no
       * need to measure its height. `invisible` keeps a closed answer out of the accessibility tree
       * once the animation ends, while its text stays in the HTML for crawlers. It has no
       * `role="region"` on purpose: with many panels the APG advises against that many landmarks.
       */}
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 font-sans text-sm leading-relaxed text-text-secondary sm:text-base">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
