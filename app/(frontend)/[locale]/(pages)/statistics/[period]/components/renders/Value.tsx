import { useFormatter, useTranslations } from 'next-intl';
import type { ValuesCategory } from '../../../../../../../types/api/statistics.types';
import { formatMetric, metricFormat, METRICS, visibleMetrics } from '../../utils/metrics';

/**
 * One values category: its title and description, the first metric as the big number and the rest
 * as a short list. Rendered on the server, so numbers are formatted once, with the real locale.
 */
export function ValueRender({ category }: { category: ValuesCategory }) {
  const tCategory = useTranslations('Statistics.categories');
  const tMetric = useTranslations('Statistics.metrics');
  const format = useFormatter();
  const [primary, ...rest] = visibleMetrics(category.data);

  if (!primary) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border bg-card px-3 py-2 sm:px-5 sm:py-4">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs sm:text-sm uppercase text-accent flex items-center gap-3">
          METRICA
        </span>
        <div>
          <span className="font-mono text-sm font-semibold sm:text-base">
            {tCategory(`${category.category}.title`)}
          </span>
          <p className="text-xs text-text-secondary sm:text-sm">
            {tCategory(`${category.category}.description`)}
          </p>
        </div>
      </div>
      <dl className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <dt className="font-mono text-[9.5px] leading-none font-bold tracking-[0.13em] text-text-tertiary uppercase">
            {tMetric(primary.key)}
          </dt>
          <dd
            className={`font-mono text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-bold tracking-[-0.045em] text-text ${
              METRICS[primary.key].format === metricFormat.text ? 'capitalize' : ''
            }`}
          >
            {formatMetric(primary, primary.key, format)}
          </dd>
        </div>
        {rest.length > 0 && (
          <div className="flex flex-col gap-1.5 border-t border-border pt-3">
            {rest.map((metric) => (
              <div key={metric.key} className="flex items-baseline justify-between gap-3">
                <dt className="text-xs text-text-secondary">{tMetric(metric.key)}</dt>
                <dd
                  className={`font-mono text-xs font-semibold text-text ${
                    METRICS[metric.key].format === metricFormat.text ? 'capitalize' : ''
                  }`}
                >
                  {formatMetric(metric, metric.key, format)}
                </dd>
              </div>
            ))}
          </div>
        )}
      </dl>
    </section>
  );
}
