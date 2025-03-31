import React from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const locale = await params.locale;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('terms.title'),
    description: t('terms.description'),
  };
}

export default function TermsPage() {
  const t = useTranslations('Terms');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      
      <div className="prose prose-lg max-w-none">
        {/* <p className="mb-4">{t('lastUpdated', { date: new Date().toLocaleDateString() })}</p> */}
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section1.title')}</h2>
        <p>{t('section1.content')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section2.title')}</h2>
        <p>{t('section2.content')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section3.title')}</h2>
        <p>{t('section3.content')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section4.title')}</h2>
        <p>{t('section4.content')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section5.title')}</h2>
        <p>{t('section5.content')}</p>
        <ul className="list-disc pl-6 mb-4">
          {['item1', 'item2', 'item3'].map((key) => (
            <li key={key}>{t(`section5.items.${key}`)}</li>
          ))}
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section6.title')}</h2>
        <p>{t('section6.content')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section7.title')}</h2>
        <p>{t('section7.content')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section8.title')}</h2>
        <p>{t('section8.content')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section9.title')}</h2>
        <p>{t('section9.content')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section10.title')}</h2>
        <p>{t('section10.content')}</p>
        <p><a href={`mailto:${t('section10.email')}`} className="text-blue-600 hover:underline">{t('section10.email')}</a></p>
      </div>
    </div>
  );
} 