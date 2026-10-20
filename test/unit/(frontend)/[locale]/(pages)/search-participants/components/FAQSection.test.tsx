import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { FAQSection } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/FAQSection';
import { makeGlobalOverview } from '@/test/fixtures/overview';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Search.faq;

describe('FAQSection', () => {
  it('renders a region named by a level 2 heading', () => {
    renderWithIntl(<FAQSection globalPeriod={makeGlobalOverview()} />);

    expect(screen.getByRole('region', { name: m.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: m.title })).toBeInTheDocument();
  });

  it('hides the kicker from assistive technology', () => {
    renderWithIntl(<FAQSection globalPeriod={makeGlobalOverview()} />);

    const kicker = screen.getAllByText(m.kicker).find((node) => node.tagName === 'SPAN');
    expect(kicker).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the eight questions in the documented order', () => {
    renderWithIntl(<FAQSection globalPeriod={makeGlobalOverview()} />);

    const questions = screen.getAllByRole('button').map((button) => button.textContent);
    expect(questions).toEqual([
      m.items.scope.question,
      m.items.requirements.question,
      m.items.whySchool.question,
      m.items.matchTypes.question,
      m.items.multipleResults.question,
      m.items.years.question,
      m.items.sources.question,
      m.items.notFound.question,
    ]);
  });

  it('opens the years question and shows the figures of the global period', async () => {
    const { user } = renderWithIntl(<FAQSection globalPeriod={makeGlobalOverview()} />);

    const years = screen.getAllByRole('button')[5];
    await user.click(years);

    expect(years).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Hay datos de 26 ediciones, entre 2000 y 2025.')).toBeInTheDocument();
  });

  it('uses the fallback years question and answer when there is no global period', () => {
    renderWithIntl(<FAQSection globalPeriod={undefined} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(8);
    expect(buttons[5]).toHaveTextContent(m.items.yearsFallback.question);
    expect(screen.getByText(m.items.yearsFallback.answer)).toBeInTheDocument();
    expect(screen.queryByText(/entre 2000 y 2025/)).not.toBeInTheDocument();
  });
});
