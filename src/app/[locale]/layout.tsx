import { NextIntlClientProvider } from 'next-intl';
import { Inter } from 'next/font/google';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import MainLayout from '@/components/layout/MainLayout';
import { routing } from '@/lib/i18n/routing';
import { SubtitleProvider } from '@/contexts/SubtitleContext';
import { NextRequest, NextResponse } from 'next/server';

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

// 使用 getTranslations 从语言文件中获取元数据
export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = params.locale;
  // 使用 next-intl 的 getTranslations 获取翻译
  const t = await getTranslations({ locale, namespace: 'common' });
  
  return {
    title: t('appName'),
    description: t('slogan'),
  };
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

export function middleware(request: NextRequest) {
  const locale = request.headers.get('accept-language')?.split(',')[0] || 'zh';
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
} 