import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://flydragon.site'
  
  // 常见页面路径
  const commonRoutes = [
    '',            // 首页
    '/fix',      // 关于页面
    '/emoji',    // 联系页面
    '/translate',       // 博客列表页面
    '/tts',   // 产品页面
  ]
  
  // 支持的语言
  const locales = ['en', 'zh']
  
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // 添加主页
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  })
  
  // 为每种语言添加所有页面
  locales.forEach(locale => {
    commonRoutes.forEach(route => {
      const path = route ? `/${locale}${route}` : `/${locale}`
      sitemapEntries.push({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === `/${locale}` ? 0.8 : 0.6,
      })
    })
  })
  
  return sitemapEntries
} 