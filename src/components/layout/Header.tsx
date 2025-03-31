"use client";

import React from 'react';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '../common/LanguageSwitcher';

const Header: React.FC = () => {
  const t = useTranslations('common');
  const featureT = useTranslations('features');
  const pathname = usePathname();
  const locale = useLocale();
  
  // 获取导航项的样式
  const getLinkClassName = (path: string) => {
    // 更精确地检测当前路径
    let isActive = false;
    
    if (path === '/') {
      // 首页的情况
      isActive = pathname === '/' || pathname === '';
    } else {
      // 其他页面的情况
      isActive = pathname === path;
    }
    
    return `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      isActive
        ? 'border-indigo-500 text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`;
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                {t('appName')}
              </Link>
            </div>
            <nav className="ml-6 flex space-x-8">
              <Link href="/" className={getLinkClassName('/')}>
                {t('workflow')}
              </Link>
              <Link href="/fix" className={getLinkClassName('/fix')}>
                {featureT('fix')}
              </Link>
              <Link href="/emoji" className={getLinkClassName('/emoji')}>
                {featureT('emoji')}
              </Link>
              <Link href="/translate" className={getLinkClassName('/translate')}>
                {featureT('translate')}
              </Link>
              <Link href="/tts" className={getLinkClassName('/tts')}>
                {featureT('tts')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 