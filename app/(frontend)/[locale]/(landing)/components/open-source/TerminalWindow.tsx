import type { ReactNode } from 'react';

const WINDOW_DOTS = ['bg-[#c0392b]', 'bg-[#d4a017]', 'bg-[#1f9d55]'];

/**
 * A terminal window: title bar with the three dots and a title, then the content in mono.
 * It is a terminal, so its colours are fixed and do not follow the light/dark theme.
 */
export function TerminalWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#1a2236] bg-[#050810] shadow-2xl shadow-black/40">
      <div className="flex items-center gap-4 border-b border-[#1a2236] px-5 py-3.5">
        <div aria-hidden="true" className="flex gap-2">
          {WINDOW_DOTS.map((color) => (
            <span key={color} className={`size-3 rounded-full ${color}`} />
          ))}
        </div>
        <span className="font-mono text-xs text-[#7c86a2]">{title}</span>
      </div>
      <div className="flex min-h-64 flex-col gap-3 px-5 py-6 font-mono text-xs sm:px-6 sm:text-sm">
        {children}
      </div>
    </div>
  );
}
