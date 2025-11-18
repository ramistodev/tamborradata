import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tamborradata.com';
  const currentYear = new Date().getFullYear();

  const yearUrls = [];

  for (let i = 0; i <= currentYear - 2018; i++) {
    const year = 2018 + i;
    if (year === 2021) continue; // 2021 no tiene datos disponibles
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
