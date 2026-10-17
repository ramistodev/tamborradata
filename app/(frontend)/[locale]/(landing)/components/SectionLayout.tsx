import { SectionTitle } from './SectionTitle';

export function SectionLayout({
  children,
  className,
  secondaryBg,
  index,
  title,
}: {
  className?: string;
  children: React.ReactNode;
  secondaryBg?: boolean;
  index: number;
  title: string;
}) {
  return (
    <div
      className={`w-full flex flex-col justify-center items-center py-10 ${secondaryBg ? 'bg-bg-secondary border-y border-border' : ''}`}
    >
      <div className="w-full max-w-6xl flex flex-col gap-4 px-4 sm:px-6">
        <SectionTitle index={index} title={title} />
        {children}
      </div>
    </div>
  );
}
