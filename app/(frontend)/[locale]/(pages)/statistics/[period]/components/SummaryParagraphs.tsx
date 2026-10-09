import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { EditorialTemplate } from '../../../../../../types/api/statistics.types';

export function SummaryParagraphs({ p }: { p: EditorialTemplate }) {
  if (!p.summary || !p.section) return null;

  return (
    <div className="max-w-220 flex flex-col gap-3 text-sm sm:text-md md:text-base">
      <div className="flex gap-3 text-base md:text-lg lg:text-xl text-text-secondary">
        <span className="w-0.5 shrink-0 rounded-full bg-accent" />
        <div className="py-1 md:py-2 text-justify">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{p.summary}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
