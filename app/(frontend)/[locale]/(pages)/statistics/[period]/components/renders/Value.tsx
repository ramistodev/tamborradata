import { useFormatter, useTranslations } from 'next-intl';
import type { ValuesCategory } from '../../../../../../../types/api/statistics.types';
import { formatMetric, metricFormat, METRICS, visibleMetrics } from '../../utils/metrics';

/**
 * One values category: title and description on top, then the first metric as the big number and
 * the rest as a short list. Inside a `ValuesGrid` row all cards share the same width (`flex-1`,
 * never below `min-w-*`) and the same height (the row stretches them), and the metrics block sticks
 * to the bottom so the big numbers line up. Rendered on the server, so numbers are formatted once,
 * with the real locale.
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
    <div className="flex min-w-70 md:min-w-120 flex-1 flex-col justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:min-w-72 sm:p-5">
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h3 className="text-sm font-bold sm:text-base">
            {tCategory(`${category.category}.title`)}
          </h3>
          <p className="text-xs text-text-secondary sm:text-sm">
            {tCategory(`${category.category}.description`)}
          </p>
        </header>

        <dl className="mt-auto flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              {tMetric(primary.key)}
            </dt>
            <dd
              className={`font-mono text-3xl font-bold tracking-tight text-text sm:text-4xl ${
                METRICS[primary.key].format === metricFormat.text ? 'capitalize' : ''
              }`}
            >
              {formatMetric(primary, primary.key, format)}
            </dd>
          </div>
        </dl>
      </div>
      {rest.length > 0 && (
        <dl className="flex flex-col divide-y divide-border border-t border-border">
          {rest.map((metric) => (
            <div key={metric.key} className="flex items-baseline justify-between gap-3 py-2">
              <dt className="text-xs text-text-secondary sm:text-sm">{tMetric(metric.key)}</dt>
              <dd
                className={`font-mono text-xs font-semibold text-text sm:text-sm ${
                  METRICS[metric.key].format === metricFormat.text ? 'capitalize' : ''
                }`}
              >
                {formatMetric(metric, metric.key, format)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
