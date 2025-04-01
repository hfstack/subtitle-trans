import createMiddleware from 'next-intl/middleware';
import { routing } from './src/lib/i18n/routing';

// 创建带有国际化的中间件
const middleware = createMiddleware({
  ...routing,
  localePrefix: 'as-needed'
});

export default middleware;

// 配置匹配路径，排除根路径
export const config = {
  matcher: [
    // 只匹配带有语言前缀的路径
    '/(zh|en|es|fr|de|ja|ko)/:path*',
    // 排除 api 和静态资源
    '/((?!api|_next|.*\\.|_vercel).*)'
  ]
}; 
