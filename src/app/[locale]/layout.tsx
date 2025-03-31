import { NextIntlClientProvider } from 'next-intl';
import { Inter } from 'next/font/google';
import { setRequestLocale } from 'next-intl/server';
import MainLayout from '@/components/layout/MainLayout';
import { routing } from '@/lib/i18n/routing';
import { SubtitleProvider } from '@/contexts/SubtitleContext';

import '../globals.css';

// 使用 variable 名称来避免 hydration 错误
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  // 设置请求语言环境
  setRequestLocale(locale);

  // 获取消息
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    // 如果找不到消息文件，使用默认语言
    messages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
  }

  return (
    <html lang={locale} suppressHydrationWarning className={inter.variable}>
      <body className="font-sans">
        <SubtitleProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <MainLayout>
              {children}
            </MainLayout>
          </NextIntlClientProvider>
        </SubtitleProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'AI字幕助手',
  description: '使用AI技术处理字幕，支持翻译、添加表情、修复和转语音',
}; 