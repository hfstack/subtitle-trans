import React from 'react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: { locale: string } }) {
  const { locale } = props.params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('Privacy.title'),
    description: t('Privacy.description'),
  };
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 