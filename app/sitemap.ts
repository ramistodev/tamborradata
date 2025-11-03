import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tamborradata.com';
  const currentYear = new Date().getFullYear();

  const yearUrls = [];
  for (let year = 2018; year <= currentYear; year++) {
    if (year === 2021) continue; // (Si no hubo datos ese año)
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
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/statistics/global`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/statistics/info`,
      lastModified: new Date('2025-11-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...yearUrls,
  ];
}
