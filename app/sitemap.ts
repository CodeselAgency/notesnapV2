import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://notesnap.app/'
  
  // Blog posts data
  const blogPosts = [
    {
      slug: 'summarize-academic-papers-ai',
      lastModified: new Date('2025-05-17'),
    },
    {
      slug: 'best-ai-tools-chat-pdfs',
      lastModified: new Date('2025-05-17'),
    },
    {
      slug: 'generate-flashcards-from-pdfs',
      lastModified: new Date('2025-05-17'),
    },
  ]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/use-cases`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
} 