import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './src/lib/i18n/routing';

// 要支持的语言列表 (需要根据你的项目支持的语言进行调整)
const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko'];

// 处理根路径请求
function handleRootPath(request: NextRequest) {
  // 只对根路径进行处理
  if (request.nextUrl.pathname !== '/') {
    return;
  }

  // 获取浏览器语言偏好
  const acceptLanguage = request.headers.get('accept-language') || '';
  const browserLanguages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().substring(0, 2).toLowerCase());

  // 尝试匹配浏览器语言和支持的语言
  const matchedLocale = browserLanguages.find(lang => locales.includes(lang)) || 'en';

  // 使用 rewrite 而不是 redirect，这样用户不会看到重定向过程
  const url = request.nextUrl.clone();
  url.pathname = `/${matchedLocale}`;
  
  return NextResponse.rewrite(url);
}

// 创建带有国际化的中间件
const intlMiddleware = createMiddleware({
  ...routing,
  localePrefix: 'as-needed'
});

// 导出中间件
export default function middleware(request: NextRequest) {
  // 对根路径进行处理
  if (request.nextUrl.pathname === '/') {
    return handleRootPath(request);
  }
  
  // 其他路径使用 next-intl 中间件
  return intlMiddleware(request);
}

// 配置匹配路径
export const config = {
  // 匹配所有路径，除了 api、_next 和静态文件
  matcher: [
    // 匹配所有路径，除了 api、_next、静态文件
    '/((?!api|_next|.*\\.|_vercel).*)'
  ]
}; 
