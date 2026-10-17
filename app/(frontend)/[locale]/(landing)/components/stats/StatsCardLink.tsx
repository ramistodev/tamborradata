import { Link } from '@/app/(frontend)/i18n/navigation';
import { Icons } from '../../../components/Icons';
import { StatsCardTone, statsCardTones } from './statsCardTone';

/** Pill link shown at the bottom of every stats card, pushed down by `mt-auto`. */
export function StatsCardLink({
  tone,
  label,
  href,
}: {
  tone: StatsCardTone;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`mt-auto inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-[opacity,color,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${statsCardTones[tone].cta}`}
    >
      {label}
      <Icons.ArrowRight className="size-4" />
    </Link>
  );
}
