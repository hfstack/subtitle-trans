"use client";

import React from 'react';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../common/LanguageSwitcher';

const Header: React.FC = () => {
  const t = useTranslations('common');
  const pathname = usePathname();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                字幕工具箱
              </Link>
            </div>
            <nav className="ml-6 flex space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900">
                工作流
              </Link>
              <Link href="/repair" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                字幕修复
              </Link>
              <Link href="/emoji" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                添加表情
              </Link>
              <Link href="/translate" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                字幕翻译
              </Link>
              <Link href="/tts" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                转语音
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