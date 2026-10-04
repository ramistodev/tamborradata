// Only client-safe exports belong here: this barrel is imported by client components.
// Header and Footer are server components (Header fetches data), import them directly.
import { Icons } from './Icons';

export { Icons };
