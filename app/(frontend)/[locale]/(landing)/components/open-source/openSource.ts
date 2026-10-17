export const REPO_URL = 'https://github.com/ramistodev/tamborradata';
export const REPO_NAME = 'ramistodev/tamborradata';

export const TECH_STACK = ['Next.js', 'React', 'TypeScript', 'GSAP'];

export interface TerminalLineData {
  kind: 'command' | 'output';
  text: string;
}

/**
 * What the terminal "types": cloning, installing and running the project locally. The commands and
 * the output of git and Next are what those tools print, so they are not translated; the
 * "dependencies installed" line is ours, and `installedText` is its translation.
 */
export function buildTerminalLines(installedText: string): TerminalLineData[] {
  return [
    { kind: 'command', text: `git clone github.com/${REPO_NAME}` },
    { kind: 'output', text: "Cloning into 'tamborradata'…" },
    { kind: 'command', text: 'pnpm install' },
    { kind: 'output', text: installedText },
    { kind: 'command', text: 'pnpm dev' },
    { kind: 'output', text: 'Ready on http://localhost:3000' },
  ];
}
