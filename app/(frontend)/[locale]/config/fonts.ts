import { Sora, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

// Fonts
export const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});
