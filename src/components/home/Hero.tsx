"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import Image from 'next/image';
import exampleImage from '@/assets/images/example.png';

const Hero = () => {
  const t = useTranslations('home.hero');
  const commonT = useTranslations('common');
  
  return (
    <div className="relative bg-white overflow-hidden pt-6 sm:pt-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:pb-28 xl:pb-32">
          <div className="lg:absolute lg:inset-y-0 lg:left-0 lg:bg-white lg:bg-opacity-90 lg:w-1/2"></div>
          <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
                <span className="block xl:inline">{t('title')}</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:text-lg sm:max-w-xl sm:mx-auto md:text-xl lg:mx-0">
                {t('description')}
              </p>
              <div className="mt-5 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href="#workflow"
                    className="w-full flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-lg md:px-8"
                  >
                    {commonT('startUsing')}
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="#features"
                    className="w-full flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-3 md:text-lg md:px-8"
                  >
                    {commonT('features')}
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <Image
          className="h-64 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src={exampleImage}
          alt={commonT('appName')}
          priority
        />
      </div>
    </div>
  );
};

export default Hero; 