import { MetadataRoute } from 'next'
import { routing } from '@/lib/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://flydragon.site'
  
  // 创建基础路由
  const routes = [
    '',
    '/translate',
    '/emoji',
    '/fix',
    '/tts',
    '/privacy',
    '/terms',
  ]
  
  // 为每个支持的语言创建URL
  const urls = routing.locales.flatMap(locale => 
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )
  
  return urls
} 