import React from 'react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'features' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  
  return {
    title: `${t('fix')} | ${commonT('appName')}`,
    description: t('fixDescription'),
  };
}

export default function FixLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 