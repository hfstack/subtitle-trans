import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './lib/i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // 获取请求的语言环境
  let locale = await requestLocale;
  
  // 确保传入的语言环境有效
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // 加载消息
  let messages;
  try {
    messages = (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    try {
      // 如果找不到消息文件，使用默认语言
      messages = (await import(`./messages/${routing.defaultLocale}.json`)).default;
    } catch (fallbackError) {
      console.error('Could not load fallback messages:', fallbackError);
      // 如果连默认语言都找不到，返回空对象
      messages = {};
    }
  }

  return {
    locale,
    messages,
    // 确保时区设置正确
    timeZone: 'Asia/Shanghai'
  };
}); 