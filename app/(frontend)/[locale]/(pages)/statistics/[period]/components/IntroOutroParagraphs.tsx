import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { IntroOutro } from '../../../../../../types/api/statistics.types';

export function IntroOutroParagraphs({ p }: { p: IntroOutro }) {
  return (
    <div className="max-w-220 flex flex-col gap-3 text-sm sm:text-md md:text-base">
      <div className="flex gap-3 text-base md:text-lg lg:text-xl text-text-secondary">
        <span className="w-0.5 shrink-0 rounded-full bg-accent" />
        <div className="py-1 md:py-2">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{p.summary}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
