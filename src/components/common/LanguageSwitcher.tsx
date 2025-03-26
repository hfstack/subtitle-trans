"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';
import Link from 'next/link';

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // 获取当前语言
  const currentLocale = pathname.split('/')[1] || routing.defaultLocale;
  
  const languageNames: Record<string, string> = {
    zh: '中文',
    en: 'English',
  };
  
  const handleLanguageChange = (locale: string) => {
    // 构建新路径 - 替换当前语言前缀
    const newPath = pathname.replace(/^\/[^\/]+/, `/${locale}`);
    
    // 使用 router.push 而不是 router.replace
    router.push(newPath);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-1">
          {languageNames[currentLocale] || languageNames[routing.defaultLocale]}
        </span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            {routing.locales.map((locale) => (
              <button
                key={locale}
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                onClick={() => handleLanguageChange(locale)}
              >
                {languageNames[locale]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 