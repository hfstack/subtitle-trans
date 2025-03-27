import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'features' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  
  return {
    title: `${t('tts')} | ${commonT('appName')}`,
    description: t('ttsDescription'),
  };
} 