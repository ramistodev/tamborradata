import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTableSkeleton } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/DataTableSkeleton';

describe('DataTableSkeleton', () => {
  it('renders the requested number of hidden rows with three cells each', () => {
    const { container } = render(
      <table>
        <tbody>
          <DataTableSkeleton rows={3} />
        </tbody>
      </table>,
    );

    const rows = container.querySelectorAll('tr');

    expect(rows).toHaveLength(3);
    rows.forEach((row) => {
      expect(row).toHaveAttribute('aria-hidden', 'true');
      expect(row.querySelectorAll('td')).toHaveLength(3);
    });
  });

  it('renders nothing for zero rows', () => {
    const { container } = render(
      <table>
        <tbody>
          <DataTableSkeleton rows={0} />
        </tbody>
      </table>,
    );

    expect(container.querySelectorAll('tr')).toHaveLength(0);
  });
});
