import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://selora.dev',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://selora.dev/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://selora.dev/dashboard',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
}
