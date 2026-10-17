import type { TerminalLineData } from './openSource';

/** A command (with a `$` prompt) or its output (with a check mark). The marks are not selectable. */
export function TerminalLine({ kind, text }: TerminalLineData) {
  const isCommand = kind === 'command';

  return (
    <p className={isCommand ? 'text-[#9aa4bd]' : 'text-[#34d399]'}>
      <span
        aria-hidden="true"
        className={`mr-3 select-none ${isCommand ? 'text-[#4d8cff]' : 'text-[#34d399]'}`}
      >
        {isCommand ? '$' : '✓'}
      </span>
      {text}
    </p>
  );
}
