import { screen } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { FAQSection } from '@/app/(frontend)/[locale]/(landing)/components/faq/FAQSection';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';
import { makeOverviewResponse } from '@/test/fixtures/overview';

const m = messagesByLocale.es;
const tItems = createTranslator({ locale: 'es', messages: m, namespace: 'Landing.faq.items' } as never);

describe('FAQSection', () => {
  it('renders the title as a level two heading', () => {
    renderWithIntl(<FAQSection overview={makeOverviewResponse()} />);

    expect(screen.getByRole('heading', { level: 2, name: m.Landing.faq.title })).toBeInTheDocument();
  });

  it('lists 15 closed questions', () => {
    renderWithIntl(<FAQSection overview={makeOverviewResponse()} />);

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(15);
    buttons.forEach((button) => expect(button).toHaveAttribute('aria-expanded', 'false'));
  });

  it('starts with the question about what Tamborradata is', () => {
    renderWithIntl(<FAQSection overview={makeOverviewResponse()} />);

    expect(screen.getAllByRole('button')[0]).toHaveAccessibleName(m.Landing.faq.items.what.question);
  });

  it('opens a question and shows its answer with the first year', async () => {
    const { user } = renderWithIntl(<FAQSection overview={makeOverviewResponse()} />);

    const button = screen.getByRole('button', { name: m.Landing.faq.items.what.question });
    await user.click(button);

    const answer = screen.getByText(tItems('what.answer', { hasStart: 'yes', startYear: '2000' }));

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(answer).toBeInTheDocument();
    expect(answer).toHaveTextContent('2000');
  });

  it('answers with the fallback texts when there is no overview', () => {
    renderWithIntl(<FAQSection overview={null} />);

    expect(screen.getAllByRole('button')).toHaveLength(15);
    expect(screen.getByText(m.Landing.faq.items.topName.fallback)).toBeInTheDocument();
  });

  it('hides the decorative question mark from assistive technology', () => {
    renderWithIntl(<FAQSection overview={makeOverviewResponse()} />);

    expect(screen.getByText('?')).toHaveAttribute('aria-hidden', 'true');
  });
});
