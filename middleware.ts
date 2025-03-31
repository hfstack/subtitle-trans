import createMiddleware from 'next-intl/middleware';
import { routing } from './src/lib/i18n/routing';

// 创建中间件
export default createMiddleware({
  ...routing,
  // 添加默认语言重定向
  localePrefix: 'as-needed'
});

// 配置匹配路径
export const config = {
  // 匹配所有路径，除了 api、_next 和静态文件
  matcher: [
    // 匹配所有路径，除了 api、_next、静态文件
    '/((?!api|_next|.*\\.|_vercel).*)'
  ]
}; 