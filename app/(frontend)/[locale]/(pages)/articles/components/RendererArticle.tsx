import { blockType, type ArticleContent } from '../types/article.types';
import { ChipListRender } from './blocks/ChipListRender';
import { CompareRender } from './blocks/CompareRender';
import { DataTableRender } from './blocks/DataTableRender';
import { DistributionChartRender } from './blocks/DistributionChartRender';
import { HeadingRender } from './blocks/HeadingRender';
import { HilightedTextRender } from './blocks/HilightedTextRender';
import { HorizontalBarChartRender } from './blocks/HorizontalBarChartRender';
import { SeriesChartRender } from './blocks/SeriesChartRender';
import { SourcesRender } from './blocks/SourcesRender';
import { StepsRender } from './blocks/StepsRender';
import { TextRender } from './blocks/TextRender';
import { TokenBreakdownRender } from './blocks/TokenBreakdownRender';
import { VariantGroupsRender } from './blocks/VariantGroupsRender';
import { WaffleChartRender } from './blocks/WaffleChartRender';

type BlockKind = 'heading' | 'prose' | 'figure';

function kindOf(block: ArticleContent): BlockKind {
  if (block.blockType === blockType.heading) return 'heading';
  if (block.blockType === blockType.text) return 'prose';
  return 'figure';
}

function spacingBefore(previous: BlockKind | null, current: BlockKind) {
  if (previous === null) return '';
  if (current === 'heading') return 'mt-14 md:mt-20';
  if (previous === 'heading') return 'mt-4 md:mt-5';
  if (previous === 'prose' && current === 'prose') return 'mt-4 md:mt-5';
  return 'mt-8 md:mt-10';
}

function renderBlock(block: ArticleContent) {
  switch (block.blockType) {
    case blockType.heading:
      return <HeadingRender block={block} />;
    case blockType.text:
      return <TextRender block={block} />;
    case blockType.hilightedText:
      return <HilightedTextRender block={block} />;
    case blockType.horizontalBarChart:
      return <HorizontalBarChartRender block={block} />;
    case blockType.seriesChart:
      return <SeriesChartRender block={block} />;
    case blockType.waffleChart:
      return <WaffleChartRender block={block} />;
    case blockType.distributionChart:
      return <DistributionChartRender block={block} />;
    case blockType.dataTable:
      return <DataTableRender block={block} />;
    case blockType.chipList:
      return <ChipListRender block={block} />;
    case blockType.compare:
      return <CompareRender block={block} />;
    case blockType.tokenBreakdown:
      return <TokenBreakdownRender block={block} />;
    case blockType.variantGroups:
      return <VariantGroupsRender block={block} />;
    case blockType.steps:
      return <StepsRender block={block} />;
    case blockType.sources:
      return <SourcesRender block={block} />;
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}

export function RendererArticle({ content }: { content: ArticleContent[] }) {
  return (
    <div className="flex flex-col">
      {content.map((block, index) => {
        const kind = kindOf(block);
        const previous = index > 0 ? kindOf(content[index - 1]) : null;

        return (
          <div key={index} className={spacingBefore(previous, kind)}>
            {renderBlock(block)}
          </div>
        );
      })}
    </div>
  );
}
