import React from 'react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: { locale: string } }) {
  const { locale } = props.params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('Terms.title'),
    description: t('Terms.description'),
  };
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 