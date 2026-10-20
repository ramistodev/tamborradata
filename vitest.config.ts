import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// Inherited by every worker process (forks copy the parent env). Also repeated in test.env below.
process.env.TZ = 'Europe/Madrid';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const serverOnlyStub = fileURLToPath(new URL('./test/mocks/server-only.ts', import.meta.url));

const nodeSetup = ['./test/setup/common.ts'];
const domSetup = ['./test/setup/common.ts', './test/setup/dom.ts'];

export default defineConfig({
  plugins: [
    tsconfigPaths({ root: rootDir, projects: ['./tsconfig.test.json'] }),
    react(),
  ],
  resolve: {
    alias: { 'server-only': serverOnlyStub },
  },
  test: {
    globals: false,
    env: {
      TZ: 'Europe/Madrid',
      SUPABASE_URL: 'http://127.0.0.1:54321',
      SUPABASE_ANON_KEY: 'test-anon-key',
      SIGNATURE_SECRET: 'test-signature-secret-0123456789abcdef',
      HASH_SECRET: 'test-hash-secret-0123456789abcdef',
      NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
    },
    restoreMocks: true,
    mockReset: true,
    unstubEnvs: true,
    unstubGlobals: true,
    server: { deps: { inline: [/next-intl/] } },
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['app/**/*.{ts,tsx}', 'proxy.ts'],
      // Do NOT write literal "(backend)" / "[locale]" in these globs: picomatch treats () and [] as
      // regex/char-class syntax. Only wildcard-safe patterns below.
      exclude: [
        '**/*.d.ts',
        '**/*.css',
        'app/types/api/**',
        'app/types/statistics/index.ts',
        '**/api/*/types/index.ts',
        '**/components/index.ts',
        '**/ui/index.ts',
        '**/Series/index.ts',
        '**/Series/types.ts',
        '**/Select/types.ts',
        '**/structured-data/period/types.ts',
        '**/i18n/types.ts',
        '**/i18n/request.ts',
        '**/config/fonts.ts',
      ],
      // Measured on 2026-10-20 (rounded down). Async server components and pages are covered by
      // e2e only and stay in the denominator on purpose.
      thresholds: {
        lines: 95,
        statements: 95,
        functions: 96,
        branches: 95,
        'app/*/lib/**': { lines: 100 },
        '**/api/*/repo/**': { lines: 100 },
        '**/api/*/service/**': { lines: 99 },
        '**/api/*/services/**': { lines: 98 },
        '**/api/**/route.ts': { lines: 100 },
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: ['test/unit/**/*.test.ts'],
          setupFiles: nodeSetup,
        },
      },
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          environmentOptions: { jsdom: { url: 'http://localhost:3000/' } },
          include: ['test/unit/**/*.test.tsx'],
          setupFiles: domSetup,
        },
      },
    ],
  },
});
