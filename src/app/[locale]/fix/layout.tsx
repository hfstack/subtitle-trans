import React from 'react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
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