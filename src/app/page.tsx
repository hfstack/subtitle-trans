import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// 支持的语言列表
const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko'];

export default async function RootPage() {
  // 获取请求头
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // 解析浏览器语言
  const browserLanguages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().substring(0, 2).toLowerCase());

  // 匹配支持的语言，默认为英语
  const locale = browserLanguages.find(lang => locales.includes(lang)) || 'en';

  // 重定向到对应的语言路径
  redirect(`/${locale}`);
}
