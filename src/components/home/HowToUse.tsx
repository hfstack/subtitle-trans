"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

const HowToUse = () => {
  const t = useTranslations('home.howToUse');
  
  const steps = [
    {
      number: 1,
      titleKey: 'step1Title',
      descriptionKey: 'step1Description',
    },
    {
      number: 2,
      titleKey: 'step2Title',
      descriptionKey: 'step2Description',
    },
    {
      number: 3,
      titleKey: 'step3Title',
      descriptionKey: 'step3Description',
    },
  ];
  
  return (
    <section id="how-to-use" className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">{t('title')}</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{t(step.titleKey)}</h3>
              <p className="text-gray-600">{t(step.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse; 