import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { SourcesRender } from '@/app/(frontend)/[locale]/(pages)/articles/components/blocks/SourcesRender';
import { blockType, type SourcesBlock } from '@/app/(frontend)/[locale]/(pages)/articles/types/article.types';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const opensInNewTab = messagesByLocale.es.Articles.article.sourceOpensInNewTab;

const block: SourcesBlock = {
  blockType: blockType.sources,
  items: [
    {
      title: 'Ley 17/1977',
      publisher: 'BOE',
      year: '8-1-1977',
      url: 'https://www.boe.es/boe/dias/1977/01/08/pdfs/A00393-00393.pdf',
      note: 'Una nota',
    },
    { title: 'Sin enlace', publisher: 'Archivo' },
  ],
};

describe('SourcesRender', () => {
  it('renders one list item per source', () => {
    renderWithIntl(<SourcesRender block={block} />);

    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders the source with a url as an external link that announces the new tab', () => {
    renderWithIntl(<SourcesRender block={block} />);

    const link = screen.getByRole('link', { name: `Ley 17/1977 ${opensInNewTab}` });
    expect(link).toHaveAttribute('href', block.items[0].url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows the publisher and year, the note and the host without www', () => {
    renderWithIntl(<SourcesRender block={block} />);

    expect(screen.getByText('BOE · 8-1-1977')).toBeInTheDocument();
    expect(screen.getByText('Una nota')).toBeInTheDocument();
    expect(screen.getByText('boe.es')).toBeInTheDocument();
  });

  it('renders a source without url as plain text with no link', () => {
    renderWithIntl(<SourcesRender block={block} />);

    expect(screen.getByText('Sin enlace')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });
});
