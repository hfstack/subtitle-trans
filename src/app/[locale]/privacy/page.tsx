import React from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = await params.locale;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('privacy.title'),
    description: t('privacy.description'),
  };
}

export default function PrivacyPage() {
  const t = useTranslations('Privacy');
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="mb-4">{t('lastUpdated', { date: new Date().toLocaleDateString() })}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section1.title')}</h2>
          <p>{t('section1.content')}</p>
          <ul className="list-disc pl-6 mb-4">
            {Array.isArray(t('section1.items')) 
              ? t('section1.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))
              : <li>{t('section1.items')}</li>
            }
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section2.title')}</h2>
          <p>{t('section2.content')}</p>
          <ul className="list-disc pl-6 mb-4">
            {Array.isArray(t('section2.items')) 
              ? t('section2.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))
              : <li>{t('section2.items')}</li>
            }
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section3.title')}</h2>
          <p>{t('section3.content')}</p>
          <ul className="list-disc pl-6 mb-4">
            {Array.isArray(t('section3.items')) 
              ? t('section3.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))
              : <li>{t('section3.items')}</li>
            }
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section4.title')}</h2>
          <p>{t('section4.content')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section5.title')}</h2>
          <p>{t('section5.content')}</p>
          <ul className="list-disc pl-6 mb-4">
            {Array.isArray(t('section5.items')) 
              ? t('section5.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))
              : <li>{t('section5.items')}</li>
            }
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('section6.title')}</h2>
          <p>{t('section6.content')}</p>
          <p><a href={`mailto:${t('section6.email')}`} className="text-blue-600 hover:underline">{t('section6.email')}</a></p>
        </div>
      </div>
    </div>
  );
} 