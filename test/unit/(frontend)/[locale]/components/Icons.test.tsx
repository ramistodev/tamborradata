import type { ComponentType } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icons } from '@/app/(frontend)/[locale]/components/Icons';

type IconComponent = ComponentType<{ className?: string }>;

const icons = Icons as Record<string, IconComponent>;

function renderSvg(name: string, className?: string): SVGElement {
  const Icon = icons[name];
  const { container } = render(<Icon className={className} />);
  const svg = container.querySelector('svg');

  if (!svg) throw new Error(`${name} did not render an svg`);

  return svg;
}

const classNameIcons = [
  'ArrowRight',
  'ArrowLeft',
  'ChevronUp',
  'ChevronDown',
  'ArrowUp',
  'GithubIcon',
  'MailIcon',
  'SearchIcon',
  'ExclamationCircle',
  'RetryIcon',
  'CheckMark',
  'GraduationCap',
  'ExternalLink',
];

const defaultSizes: [string, string][] = [
  ['ArrowLeft', 'size-4'],
  ['ArrowUp', 'size-4'],
  ['ChevronUp', 'size-5'],
  ['ChevronDown', 'size-5'],
  ['GithubIcon', 'size-6'],
  ['MailIcon', 'size-6'],
  ['SearchIcon', 'size-6'],
  ['ExclamationCircle', 'size-4'],
  ['RetryIcon', 'size-4'],
  ['CheckMark', 'size-4'],
  ['GraduationCap', 'size-4'],
  ['ExternalLink', 'size-4'],
];

const fixedSizes: [string, string[]][] = [
  ['CheckIcon', ['size-5']],
  ['QuestionIcon', ['size-5']],
  ['ClockIcon', ['size-5']],
  ['ChevronRight', ['size-5']],
  ['CloseIcon', ['size-6']],
  ['HamburgerIcon', ['size-6']],
  ['ChartIcon', ['size-10', 'md:size-12']],
  ['CalendarIcon', ['size-10', 'md:size-12']],
  ['InfoIcon', ['size-8', 'md:size-10']],
  ['ExclamationIcon', ['size-16', 'md:size-26']],
];

const decorativeIcons = [
  'ArrowRight',
  'ArrowLeft',
  'ChevronUp',
  'ChevronDown',
  'ArrowUp',
  'GithubIcon',
  'MailIcon',
  'ExclamationCircle',
  'RetryIcon',
  'CheckMark',
  'GraduationCap',
  'ExternalLink',
];

describe('Icons', () => {
  it('exposes the expected icon set', () => {
    expect(Object.keys(Icons).sort()).toEqual([
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'CalendarIcon',
      'ChartIcon',
      'CheckIcon',
      'CheckMark',
      'ChevronDown',
      'ChevronRight',
      'ChevronUp',
      'ClockIcon',
      'CloseIcon',
      'ExclamationCircle',
      'ExclamationIcon',
      'ExternalLink',
      'GithubIcon',
      'GraduationCap',
      'HamburgerIcon',
      'InfoIcon',
      'MailIcon',
      'QuestionIcon',
      'RetryIcon',
      'SearchIcon',
    ]);
  });

  it.each(Object.keys(icons))('%s renders an svg', (name) => {
    expect(renderSvg(name)).toBeInstanceOf(SVGElement);
  });

  it.each(classNameIcons)('%s includes the className it receives', (name) => {
    expect(renderSvg(name, 'size-9').classList).toContain('size-9');
  });

  it.each(defaultSizes)('%s defaults to %s', (name, size) => {
    expect(renderSvg(name).classList).toContain(size);
  });

  it('keeps the call-to-action classes of ArrowRight by default', () => {
    const classes = renderSvg('ArrowRight').classList;

    expect(classes).toContain('size-5');
    expect(classes).toContain('ml-2');
    expect(classes).toContain('group-hover:translate-x-1');
  });

  it.each(fixedSizes)('%s has a fixed size', (name, sizes) => {
    const classes = renderSvg(name).classList;

    for (const size of sizes) {
      expect(classes).toContain(size);
    }
  });

  it.each(decorativeIcons)('%s is hidden from assistive technology', (name) => {
    expect(renderSvg(name)).toHaveAttribute('aria-hidden', 'true');
  });
});
