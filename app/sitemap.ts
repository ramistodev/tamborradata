import { MetadataRoute } from 'next';
import { fetchYears } from './(frontend)/services/fetchYears';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tamborradata.com';
  const currentYear = new Date().getFullYear();

  const years = await fetchYears(`${baseUrl}/api/available-years`);

  const yearUrls = [];
  for (const year of years?.filter((y) => y !== 'global').map((y) => Number(y)) || []) {
    yearUrls.push({
      url: `${baseUrl}/statistics/${year}`,
      lastModified: year === currentYear ? new Date() : new Date(`${year}-01-20`),
      changeFrequency: 'yearly' as const,
      priority: year === currentYear ? 0.9 : 0.7,
    });
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/statistics/global`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/statistics/info`,
      lastModified: new Date('2025-11-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...yearUrls,
  ];
}
