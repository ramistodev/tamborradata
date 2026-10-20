import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SummaryParagraphs } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/SummaryParagraphs';
import type { EditorialTemplate } from '@/app/types/api/statistics.types';

function template(summary: string): EditorialTemplate {
  return { section: 'periodIntro', summary };
}

describe('SummaryParagraphs', () => {
  describe('markdown rendering', () => {
    it('renders bold text as a strong element inside a paragraph', () => {
      const { container } = render(<SummaryParagraphs p={template('Intro **text**')} />);

      const strong = container.querySelector('strong');

      expect(strong).toHaveTextContent('text');
      expect(strong?.closest('p')).toHaveTextContent('Intro text');
    });

    it('renders emphasis as an em element', () => {
      const { container } = render(<SummaryParagraphs p={template('Some *a* word')} />);

      expect(container.querySelector('em')).toHaveTextContent('a');
    });

    it('renders a markdown list as list items', () => {
      const { container } = render(<SummaryParagraphs p={template('- a\n- b')} />);

      expect(container.querySelectorAll('li')).toHaveLength(2);
    });
  });

  describe('empty input', () => {
    it('renders nothing for an empty summary', () => {
      const { container } = render(<SummaryParagraphs p={template('')} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing when the summary is missing', () => {
      const { container } = render(<SummaryParagraphs p={{ section: 'periodIntro' } as unknown as EditorialTemplate} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing when the section is missing', () => {
      const { container } = render(<SummaryParagraphs p={{ summary: 'Text' } as unknown as EditorialTemplate} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing when the template is null', () => {
      const { container } = render(<SummaryParagraphs p={null as never} />);

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('sanitization', () => {
    it('does not create script or image elements nor event-handler attributes from raw html', () => {
      const { container } = render(
        <SummaryParagraphs p={template('<script>alert(1)</script>Hello <img src=x onerror=alert(1)>')} />,
      );

      const attributeNames = [...container.querySelectorAll('*')].flatMap((element) => element.getAttributeNames());

      expect(container.querySelector('script')).toBeNull();
      expect(container.querySelector('img')).toBeNull();
      expect(container.querySelectorAll('[onerror]')).toHaveLength(0);
      expect(attributeNames.filter((name) => name.startsWith('on'))).toEqual([]);
    });

    it('does not keep a javascript: href on a markdown link', () => {
      const { container } = render(<SummaryParagraphs p={template('[x](javascript:alert(1))')} />);

      const hrefs = [...container.querySelectorAll('a')].map((anchor) => anchor.getAttribute('href') ?? '');

      expect(hrefs.filter((href) => href.toLowerCase().startsWith('javascript:'))).toEqual([]);
    });

    it('keeps the href of a safe link', () => {
      const { container } = render(<SummaryParagraphs p={template('[x](https://example.org)')} />);

      const anchor = container.querySelector('a');

      expect(anchor).toHaveAttribute('href', 'https://example.org');
      expect(anchor).toHaveTextContent('x');
    });
  });
});
