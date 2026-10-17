import { formatNumber } from '../../lib/format';

export function SectionTitle({ index, title }: { index: number; title: string }) {
  return (
    <div className="w-full flex items-center gap-4 lg:gap-6 font-mono py-5">
      <span className="text-xs text-accent">{formatNumber(index)}</span>
      <span className="text-xs text-text-secondary uppercase">{title}</span>
      <span className="flex-1 border border-border" />
    </div>
  );
}
