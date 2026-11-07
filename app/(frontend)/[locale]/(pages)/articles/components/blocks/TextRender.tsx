import type { TextBlock } from '../../types/article.types';
import { RichText } from './RichText';

export function TextRender({ block }: { block: TextBlock }) {
  return (
    <p className="max-w-180 text-lg md:text-xl leading-relaxed text-text-secondary text-pretty">
      <RichText text={block.content} />
    </p>
  );
}
