import type { ReactNode } from 'react';

const TOKEN = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;

export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(TOKEN)) {
    const start = match.index ?? 0;

    if (start > cursor) {
      nodes.push(text.slice(cursor, start));
    }

    nodes.push(
      match[1] ? (
        <strong key={start} className="font-semibold text-text">
          {match[1]}
        </strong>
      ) : (
        <em key={start} className="not-italic text-accent">
          {match[2]}
        </em>
      )
    );
    cursor = start + match[0].length;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return <>{nodes}</>;
}
