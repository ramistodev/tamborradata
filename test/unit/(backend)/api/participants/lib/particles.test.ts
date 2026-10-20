import { describe, expect, it } from 'vitest';
import { PARTICLES, toUnits } from '@/app/(backend)/api/participants/lib/particles';

describe('PARTICLES', () => {
  it('contains the supported name particles', () => {
    expect(PARTICLES).toEqual(
      new Set(['de', 'del', 'la', 'los', 'las', 'y', 'da', 'do', 'san', "d'"])
    );
  });
});

describe('toUnits', () => {
  it.each([
    [['ramos', 'de', 'la', 'fuente'], ['ramos', 'de la fuente']],
    [['ana', 'maria', 'garcia'], ['ana', 'maria', 'garcia']],
    [[], []],
    [['de', 'la'], ['de la']],
    [['san', 'sebastian'], ['san sebastian']],
    [['ana', 'de'], ['ana', 'de']],
    [['y', 'ana', 'de', 'la', 'cruz'], ['y ana', 'de la cruz']],
    [["d'", 'arcy'], ["d' arcy"]],
  ])('groups %j into %j', (tokens, expected) => {
    expect(toUnits(tokens)).toEqual(expected);
  });

  it('does not mutate its input', () => {
    const tokens = ['ramos', 'de', 'la', 'fuente'];
    const copy = [...tokens];

    toUnits(tokens);

    expect(tokens).toEqual(copy);
  });
});
