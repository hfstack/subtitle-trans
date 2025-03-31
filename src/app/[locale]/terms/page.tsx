"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('Terms');
  
  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          
          <div className="prose prose-lg max-w-none">
            {/* <p className="mb-4">{t('lastUpdated', { date: new Date().toLocaleDateString() })}</p> */}
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('section1.title')}</h2>
              <p className="text-gray-600 mb-4">{t('section1.content')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('section2.title')}</h2>
              <p className="text-gray-600 mb-4">{t('section2.content')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('section3.title')}</h2>
              <p className="text-gray-600 mb-4">{t('section3.content')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('section4.title')}</h2>
              <p className="text-gray-600 mb-4">{t('section4.content')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('section5.title')}</h2>
              <p className="text-gray-600 mb-4">{t('section5.content')}</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  {['item1', 'item2', 'item3'].map((key) => (
                    <li key={key}>{t(`section5.items.${key}`)}</li>
                  ))}
                </ul>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('section6.title')}</h2>
              <p className="text-gray-600 mb-4">{t('section6.content')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('section7.title')}</h2>
              <p className="text-gray-600 mb-4">{t('section7.content')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('section8.title')}</h2>
              <p className="text-gray-600 mb-4">{t('section8.content')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('section9.title')}</h2>
              <p className="text-gray-600 mb-4">{t('section9.content')}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('section10.title')}</h2>
              <p className="text-gray-600 mb-4">{t('section10.content')}</p>
              <p><a href={`mailto:${t('section10.email')}`} className="text-blue-600 hover:underline">{t('section10.email')}</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 