"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  
  // 获取当前语言 - 使用 params 和 pathname 综合判断
  const getCurrentLocale = () => {
    // 首先检查 params.locale，这是 Next.js 国际化路由提供的
    if (params && params.locale && typeof params.locale === 'string' && 
        routing.locales.includes(params.locale as any)) {
      return params.locale as "zh" | "en";
    }
    
    // 如果 params.locale 不可用，尝试从 pathname 获取
    const pathLocale = pathname.split('/')[1];
    console.log('路径信息:', {
      pathname,
      pathLocale,
      isLocaleValid: routing.locales.includes(pathLocale as any),
      params
    });
    
    if (routing.locales.includes(pathLocale as any)) {
      return pathLocale as "zh" | "en";
    }
    
    // 如果都无法确定，返回默认语言
    return routing.defaultLocale;
  };
  
  // 使用状态存储当前语言，确保UI更新
  const [currentLocale, setCurrentLocale] = useState<"zh" | "en">(getCurrentLocale());
  
  // 当路径变化时更新当前语言
  useEffect(() => {
    setCurrentLocale(getCurrentLocale());
  }, [pathname, params]);
  
  const languageNames: Record<string, string> = {
    zh: '中文',
    en: 'English',
  };
  
  const handleLanguageChange = (locale: "zh" | "en") => {
    // 直接使用当前语言和目标语言构建新路径
    
    // 获取当前URL的完整路径
    const fullPath = window.location.pathname;
    console.log('完整URL路径:', fullPath);
    
    let newPath;
    
    // 检查当前URL是否包含语言前缀
    const urlSegments = fullPath.split('/').filter(Boolean);
    const hasLocalePrefix = urlSegments.length > 0 && routing.locales.includes(urlSegments[0] as any);
    
    if (hasLocalePrefix) {
      // 如果有语言前缀，替换它
      urlSegments[0] = locale;
      newPath = '/' + urlSegments.join('/');
    } else {
      // 如果没有语言前缀，添加一个
      newPath = '/' + locale + (fullPath === '/' ? '' : fullPath);
    }
    
    // 处理重复斜杠的情况
    newPath = newPath.replace(/\/+/g, '/');
    
    console.log('语言切换:', {
      从: currentLocale,
      到: locale,
      原路径: fullPath,
      新路径: newPath,
      urlSegments
    });
    
    // 立即更新当前语言状态，提供即时反馈
    setCurrentLocale(locale);
    
    // 使用 window.location.href 直接设置 URL，绕过 Next.js 路由系统
    const baseUrl = window.location.origin;
    const fullUrl = baseUrl + newPath;
    
    // 保留查询参数
    const queryString = window.location.search;
    const finalUrl = fullUrl + queryString;
    
    console.log('跳转到:', finalUrl);
    
    // 直接设置 location.href 进行跳转
    window.location.href = finalUrl;
    
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
                className={`block w-full px-4 py-2 text-sm text-left ${
                  locale === currentLocale ? 'bg-gray-100 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleLanguageChange(locale)}
                disabled={locale === currentLocale}
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