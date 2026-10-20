import { act, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CategoryGroup } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/family/CategoryGroup';
import { scrollToActiveElement } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement';
import { makeRanksCategory } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement', () => ({
  scrollToActiveElement: vi.fn(),
}));

const m = messagesByLocale.es.Statistics.categories;
const categories = () => [
  makeRanksCategory('topNames'),
  makeRanksCategory('topSecondNames'),
  makeRanksCategory('newNames'),
];
const children = () => [<p key="1">one</p>, <p key="2">two</p>, <p key="3">three</p>];

function setup() {
  return renderWithIntl(
    <CategoryGroup title="Rankings" categories={categories()}>
      {children()}
    </CategoryGroup>,
  );
}

const tabs = () => screen.getAllByRole('tab');

describe('CategoryGroup', () => {
  it('shows the title and the number of categories in the header', () => {
    setup();

    expect(screen.getByText('Rankings')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders a tablist named after the title with one tab per category', () => {
    setup();

    const tablist = screen.getByRole('tablist', { name: 'Rankings' });

    expect(within(tablist).getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      m.topNames.tab,
      m.topSecondNames.tab,
      m.newNames.tab,
    ]);
  });

  it('selects only the first tab at start', () => {
    setup();

    expect(tabs().map((tab) => tab.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
    expect(tabs().map((tab) => tab.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  });

  it('shows exactly one tabpanel named by its tab with its content, title and description', () => {
    setup();

    const panel = screen.getByRole('tabpanel', { name: m.topNames.tab });

    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(within(panel).getByText('one')).toBeInTheDocument();
    expect(within(panel).getByRole('heading', { level: 3, name: m.topNames.title })).toBeInTheDocument();
    expect(within(panel).getByText(m.topNames.description)).toBeInTheDocument();
  });

  it('keeps the inactive panels in the document but hidden', () => {
    const { container } = setup();

    expect(container.querySelectorAll('[hidden]')).toHaveLength(2);
    expect(screen.getByText('two')).not.toBeVisible();
  });

  it('selects, focuses and centers a tab on click', async () => {
    const { user } = setup();

    await user.click(tabs()[1]);

    expect(tabs()[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs()[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs()[1]).toHaveFocus();
    expect(screen.getByRole('tabpanel', { name: m.topSecondNames.tab })).toHaveTextContent('two');
    expect(scrollToActiveElement).toHaveBeenCalledWith(expect.any(HTMLElement), tabs()[1], 'smooth');
  });

  describe('keyboard', () => {
    it('moves to the next tab with ArrowRight', async () => {
      const { user } = setup();
      act(() => tabs()[0].focus());

      await user.keyboard('{ArrowRight}');

      expect(tabs()[1]).toHaveAttribute('aria-selected', 'true');
      expect(tabs()[1]).toHaveFocus();
    });

    it('wraps from the first tab to the last with ArrowLeft', async () => {
      const { user } = setup();
      act(() => tabs()[0].focus());

      await user.keyboard('{ArrowLeft}');

      expect(tabs()[2]).toHaveAttribute('aria-selected', 'true');
      expect(tabs()[2]).toHaveFocus();
    });

    it('jumps to the last and the first tab with End and Home', async () => {
      const { user } = setup();
      act(() => tabs()[0].focus());

      await user.keyboard('{End}');
      expect(tabs()[2]).toHaveAttribute('aria-selected', 'true');

      await user.keyboard('{Home}');
      expect(tabs()[0]).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('links every tab to its panel and every panel back to its tab', () => {
    setup();

    tabs().forEach((tab) => {
      const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');

      expect(panel).not.toBeNull();
      expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    });
  });

  it('renders no tablist and a role-less panel for a single category', () => {
    const { container } = renderWithIntl(
      <CategoryGroup title="Rankings" categories={[makeRanksCategory('topNames')]}>
        <p>one</p>
      </CategoryGroup>,
    );

    const panel = container.querySelector('[id$="-panel-0"]');

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(panel).not.toBeNull();
    expect(panel).not.toHaveAttribute('role');
    expect(panel).toHaveTextContent('one');
  });
});
