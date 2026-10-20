import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JsonLd } from '@/app/(frontend)/[locale]/config/structured-data/JsonLd';

describe('JsonLd', () => {
  it('renders a script with the id and the ld+json type', () => {
    const { container } = render(<JsonLd id="graph" data={{ a: 1 }} />);

    const script = container.querySelector('script#graph');
    expect(script).not.toBeNull();
    expect(script).toHaveAttribute('type', 'application/ld+json');
  });

  it('round-trips the data through JSON.parse', () => {
    const data = { '@type': 'Dataset', nested: { list: [1, 'two', { three: 3 }], flag: true }, empty: null };

    const { container } = render(<JsonLd id="graph" data={data} />);

    expect(JSON.parse(container.querySelector('script')!.textContent!)).toEqual(data);
  });

  it('escapes every "<" so the data cannot close the script tag', () => {
    const data = { name: '</script><img src=x onerror=alert(1)>' };

    const { container } = render(<JsonLd id="graph" data={data} />);

    const script = container.querySelector('script')!;
    expect(container.querySelectorAll('script')).toHaveLength(1);
    expect(container.querySelector('img')).toBeNull();
    expect(script.textContent).not.toContain('<');
    expect(JSON.parse(script.textContent!)).toEqual(data);
  });
});
