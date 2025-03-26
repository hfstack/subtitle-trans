"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const Features = () => {
  const t = useTranslations('features');
  const commonT = useTranslations('common');
  
  const features = [
    {
      id: 'translate',
      icon: '/icons/translate.svg',
      color: 'bg-blue-100',
    },
    {
      id: 'emoji',
      icon: '/icons/emoji.svg',
      color: 'bg-green-100',
    },
    {
      id: 'fix',
      icon: '/icons/fix.svg',
      color: 'bg-yellow-100',
    },
    {
      id: 'tts',
      icon: '/icons/tts.svg',
      color: 'bg-purple-100',
    },
  ];
  
  return (
    <section id="features" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{commonT('features')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className={`${feature.color} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-white">
                {feature.icon && (
                  <Image 
                    src={feature.icon} 
                    alt={t(feature.id)} 
                    width={32} 
                    height={32} 
                  />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{t(feature.id)}</h3>
              <p className="text-gray-600">{t(`${feature.id}Description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 