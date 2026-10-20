import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OpenSourceSection } from '@/app/(frontend)/[locale]/(landing)/components/open-source/OpenSourceSection';
import { REPO_URL } from '@/app/(frontend)/[locale]/(landing)/components/open-source/openSource';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Landing;

function terminalLines(): HTMLElement[] {
  const title = screen.getByText('ramistodev/tamborradata');
  const windowRoot = title.parentElement!.parentElement!;

  return Array.from(windowRoot.querySelectorAll<HTMLElement>('p'));
}

describe('OpenSourceSection', () => {
  it('renders the title as a level two heading and the description', () => {
    renderWithIntl(<OpenSourceSection />);

    expect(screen.getByRole('heading', { level: 2, name: m.openSource.title })).toBeInTheDocument();
    expect(screen.getByText(m.openSource.description)).toBeInTheDocument();
  });

  it('lists the tech stack in a named list', () => {
    renderWithIntl(<OpenSourceSection />);

    const list = screen.getByRole('list', { name: m.openSource.stackLabel });

    expect(within(list).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Next.js',
      'React',
      'TypeScript',
      'GSAP',
    ]);
  });

  it('links to the repository in a new tab', () => {
    renderWithIntl(<OpenSourceSection />);

    const link = screen.getByRole('link', { name: /Ver en GitHub/ });

    expect(link).toHaveAttribute('href', REPO_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(within(link).getByText(m.common.newTab)).toBeInTheDocument();
  });

  it('shows the terminal with six lines', () => {
    renderWithIntl(<OpenSourceSection />);

    const lines = terminalLines();

    expect(lines).toHaveLength(6);
    expect(lines[0].lastChild?.textContent).toBe('git clone github.com/ramistodev/tamborradata');
    expect(lines[3].lastChild?.textContent).toBe(m.openSource.terminal.installed);
  });
});
