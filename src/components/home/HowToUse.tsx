"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

const HowToUse = () => {
  const t = useTranslations('home');
  
  const steps = [
    {
      id: '01',
      name: t('howToUse.step1.title'),
      description: t('howToUse.step1.description'),
    },
    {
      id: '02',
      name: t('howToUse.step2.title'),
      description: t('howToUse.step2.description'),
    },
    {
      id: '03',
      name: t('howToUse.step3.title'),
      description: t('howToUse.step3.description'),
    },
    {
      id: '04',
      name: t('howToUse.step4.title'),
      description: t('howToUse.step4.description'),
    }
  ];

  return (
    <div id="how-to-use" className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">{t('howToUse.subtitle')}</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {t('howToUse.title')}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            {t('howToUse.description')}
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10">
            {steps.map((step, stepIdx) => (
              <div key={step.id} className="relative">
                <div className="relative flex items-center space-x-4">
                  <div>
                    <span className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                      {step.id}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{step.name}</h3>
                    <p className="text-base text-gray-500">{step.description}</p>
                  </div>
                </div>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute top-12 left-5 -ml-px h-full w-0.5 bg-gray-300" aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUse; 