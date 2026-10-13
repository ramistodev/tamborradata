export const PARTICLES = new Set([
  'de',
  'del',
  'la',
  'los',
  'las',
  'y',
  'da',
  'do',
  'san',
  "d'", // por si acaso
]);

// Groups the typed words into the same units the name resolver stores: a particle sticks to the
// word that follows it, so "ramos de la fuente" becomes ["ramos", "de la fuente"].
export function toUnits(tokens: string[]): string[] {
  const units: string[] = [];
  let particles: string[] = [];

  for (const token of tokens) {
    if (PARTICLES.has(token)) {
      particles.push(token);
      continue;
    }

    units.push([...particles, token].join(' '));
    particles = [];
  }

  if (particles.length > 0) {
    units.push(particles.join(' '));
  }

  return units;
}
