import { headers } from 'next/headers';
import HomePage from './[locale]/page';

// 支持的语言列表
const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko'];

export default function RootPage() {
  // 获取请求头
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // 解析浏览器语言
  const browserLanguages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().substring(0, 2).toLowerCase());

  // 匹配支持的语言，默认为英语
  const locale = browserLanguages.find(lang => locales.includes(lang)) || 'en';

  // 复用多语言页面组件
  return <HomePage params={{ locale }} />;
}
