import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChapterNav } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/ChapterNav';
import { makeFamily } from '@/test/fixtures/statistics';
import { MockIntersectionObserver } from '@/test/helpers/observers';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement', () => ({
  scrollToActiveElement: vi.fn(),
}));

const m = messagesByLocale.es;
const families = [makeFamily('names', []), makeFamily('schools', [])];
const chapters = m.Statistics.chapters;

function addChapters(ids: string[]): Record<string, HTMLElement> {
  const elements: Record<string, HTMLElement> = {};
  for (const id of ids) {
    const section = document.createElement('section');
    section.id = id;
    section.setAttribute('tabindex', '-1');
    document.body.append(section);
    elements[id] = section;
  }
  return elements;
}

describe('ChapterNav', () => {
  let elements: Record<string, HTMLElement>;

  beforeEach(() => {
    elements = addChapters(['hero', 'names', 'schools', 'closing']);
  });

  afterEach(() => {
    Object.values(elements).forEach((element) => element.remove());
    window.history.replaceState(null, '', '/');
  });

  it('renders a labelled navigation marked as the chapter nav', () => {
    renderWithIntl(<ChapterNav families={families} />);

    const nav = screen.getByRole('navigation', { name: chapters.ariaLabel });

    expect(nav).toHaveAttribute('data-chapter-nav');
  });

  it('lists the chapters in order with their anchors', () => {
    renderWithIntl(<ChapterNav families={families} />);

    const links = within(screen.getByRole('navigation')).getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual([
      chapters.hero,
      chapters.names,
      chapters.schools,
      chapters.closing,
    ]);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#hero', '#names', '#schools', '#closing']);
  });

  it('marks only the first chapter as current at start', () => {
    renderWithIntl(<ChapterNav families={families} />);

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveAttribute('aria-current', 'location');
    links.slice(1).forEach((link) => expect(link).not.toHaveAttribute('aria-current'));
  });

  it('moves the current marker when another chapter intersects', () => {
    renderWithIntl(<ChapterNav families={families} />);
    const io = MockIntersectionObserver.instances[0];

    act(() => io.triggerMany([{ target: elements.schools, isIntersecting: true, top: 0 }]));

    expect(screen.getByRole('link', { name: chapters.schools })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: chapters.hero })).not.toHaveAttribute('aria-current');
  });

  it('scrolls to the chapter, updates the hash and focuses the target on click', async () => {
    const { user } = renderWithIntl(<ChapterNav families={families} />);
    const replaceState = vi.spyOn(window.history, 'replaceState');

    await user.click(screen.getByRole('link', { name: chapters.names }));

    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));
    expect(replaceState).toHaveBeenCalledWith(null, '', '#names');
    expect(elements.names).toHaveFocus();
  });

  it('prevents the default anchor navigation on click', () => {
    renderWithIntl(<ChapterNav families={families} />);

    const notPrevented = fireEvent.click(screen.getByRole('link', { name: chapters.names }));

    expect(notPrevented).toBe(false);
  });

  it('keeps only the boundary chapters without families', () => {
    renderWithIntl(<ChapterNav families={[]} />);

    const links = screen.getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual([chapters.hero, chapters.closing]);
  });
});
