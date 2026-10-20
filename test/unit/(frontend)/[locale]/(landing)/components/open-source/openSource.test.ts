import { describe, expect, it } from 'vitest';

import { repositoryUrl } from '@/app/(frontend)/[locale]/config/constants';
import {
  REPO_NAME,
  REPO_URL,
  TECH_STACK,
  buildTerminalLines,
} from '@/app/(frontend)/[locale]/(landing)/components/open-source/openSource';

describe('openSource constants', () => {
  it('points at the GitHub repository', () => {
    expect(REPO_URL).toBe('https://github.com/ramistodev/tamborradata');
    expect(REPO_NAME).toBe('ramistodev/tamborradata');
  });

  it('matches the repository url of the site constants', () => {
    expect(REPO_URL).toBe(repositoryUrl);
  });

  it('lists the tech stack in order', () => {
    expect(TECH_STACK).toEqual(['Next.js', 'React', 'TypeScript', 'GSAP']);
  });
});

describe('buildTerminalLines', () => {
  it('builds six alternating command and output lines', () => {
    const lines = buildTerminalLines('Installed');

    expect(lines).toHaveLength(6);
    expect(lines.map((line) => line.kind)).toEqual([
      'command',
      'output',
      'command',
      'output',
      'command',
      'output',
    ]);
  });

  it('clones the repository first', () => {
    const lines = buildTerminalLines('Installed');

    expect(lines[0].text).toBe('git clone github.com/ramistodev/tamborradata');
  });

  it('uses the translated text for the install output', () => {
    const lines = buildTerminalLines('Installed');

    expect(lines[3].text).toBe('Installed');
  });

  it('ends with the local server ready line', () => {
    const lines = buildTerminalLines('Installed');

    expect(lines[5].text).toBe('Ready on http://localhost:3000');
  });
});
