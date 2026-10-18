import { SectionTitle } from './SectionTitle';

export function SectionLayout({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      className="w-full flex scroll-mt-32 flex-col items-start focus:outline-none"
    >
      <SectionTitle id={titleId} index={index} title={title} />
      <div className="w-full flex flex-col gap-4">{children}</div>
    </section>
  );
}
