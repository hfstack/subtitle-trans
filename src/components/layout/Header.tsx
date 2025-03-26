"use client";

import React from 'react';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../common/LanguageSwitcher';

const Header = () => {
  const t = useTranslations('common');
  const pathname = usePathname();
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          {t('appName')}
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link 
            href="/" 
            className={`${pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
          >
            {t('home')}
          </Link>
          <Link 
            href="/#features" 
            className="text-gray-600 hover:text-blue-600"
          >
            {t('features')}
          </Link>
          <Link 
            href="/#how-to-use" 
            className="text-gray-600 hover:text-blue-600"
          >
            {t('howToUse')}
          </Link>
        </nav>
        
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header; 