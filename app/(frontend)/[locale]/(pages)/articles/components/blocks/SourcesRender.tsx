import { useTranslations } from 'next-intl';
import { Icons } from '../../../../components/Icons';
import { getSourceHost } from '../../../search-participants/utils/getSourceHost';
import type { SourceItem, SourcesBlock } from '../../types/article.types';
import { BlockFigure } from './BlockFigure';

function byline({ publisher, year }: SourceItem) {
  return [publisher, year].filter(Boolean).join(' · ');
}

export function SourcesRender({ block }: { block: SourcesBlock }) {
  const t = useTranslations('Articles.article');

  return (
    <BlockFigure caption={block.caption} source={block.source}>
      <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        {block.items.map((item) => {
          const meta = byline(item);

          return (
            <li key={item.title} className="flex min-w-0 flex-col gap-1.5 px-4 py-4 md:px-6">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-fit max-w-full items-baseline gap-2 text-base font-semibold text-text [overflow-wrap:anywhere] underline decoration-accent decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none md:text-lg"
                >
                  <span>
                    {item.title}{' '}
                    <span className="sr-only">{t('sourceOpensInNewTab')}</span>
                  </span>
                  <Icons.ExternalLink className="size-3.5 shrink-0 self-center text-accent" />
                </a>
              ) : (
                <p className="text-base font-semibold text-text [overflow-wrap:anywhere] md:text-lg">
                  {item.title}
                </p>
              )}
              {meta && <p className="text-sm text-text-secondary text-pretty">{meta}</p>}
              {item.note && <p className="text-sm text-text-secondary text-pretty">{item.note}</p>}
              {item.url && (
                <p
                  aria-hidden="true"
                  className="font-mono text-xs uppercase tracking-wider text-accent [overflow-wrap:anywhere]"
                >
                  {getSourceHost(item.url)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </BlockFigure>
  );
}
