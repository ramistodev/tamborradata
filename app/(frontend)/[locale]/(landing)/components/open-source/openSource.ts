export const REPO_URL = 'https://github.com/ramistodev/tamborradata';
export const REPO_NAME = 'ramistodev/tamborradata';

export const TECH_STACK = ['Next.js', 'React', 'TypeScript', 'GSAP'];

export interface TerminalLineData {
  kind: 'command' | 'output';
  text: string;
}

/** What the terminal "types": cloning, installing and running the project locally. */
export const TERMINAL_LINES: TerminalLineData[] = [
  { kind: 'command', text: `git clone github.com/${REPO_NAME}` },
  { kind: 'output', text: "Cloning into 'tamborradata'…" },
  { kind: 'command', text: 'pnpm install' },
  { kind: 'output', text: 'Dependencias instaladas' },
  { kind: 'command', text: 'pnpm dev' },
  { kind: 'output', text: 'Ready on http://localhost:3000' },
];
