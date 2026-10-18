import { formatNumber } from '../../../lib/format';

export function SectionTitle({ id, index, title }: { id: string; index: number; title: string }) {
  return (
    <div className="w-full flex flex-col py-5">
      <span aria-hidden="true" className="text-xs sm:text-sm text-accent font-mono flex gap-3">
        <span>{formatNumber(index)}</span>
        <span>/</span>
      </span>
      <h2
        id={id}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tighter flex flex-col"
      >
        {title}
      </h2>
    </div>
  );
}
