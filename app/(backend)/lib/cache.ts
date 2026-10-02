export const cacheControlFor = {
  preview: () => ({
    'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60',
  }),
  summaries: () => ({
    'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60',
  }),
  category: ({ hasCursor, hasLimit }: { hasCursor: boolean; hasLimit: boolean }) => ({
    'Cache-Control':
      hasCursor || hasLimit
        ? 'no-store'
        : 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60',
  }),
};
