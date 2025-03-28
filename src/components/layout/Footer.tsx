"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations();
  
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common.appName')}</h3>
            <p className="text-gray-400">
              {t('common.slogan')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common.features')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/translate" className="text-gray-400 hover:text-white">
                  {t('features.translate')}
                </Link>
              </li>
              <li>
                <Link href="/emoji" className="text-gray-400 hover:text-white">
                  {t('features.emoji')}
                </Link>
              </li>
              <li>
                <Link href="/fix" className="text-gray-400 hover:text-white">
                  {t('features.fix')}
                </Link>
              </li>
              <li>
                <Link href="/tts" className="text-gray-400 hover:text-white">
                  {t('features.tts')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common.about')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  {t('common.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  {t('common.contact')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common.contact')}</h3>
            <p className="text-gray-400 mb-2">
              {t('footer.email')}: contact@aisubtitle.com
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM18.92 8.01C18.72 11.11 17.23 13.88 14.66 16.45C12.09 19.02 9.32 20.51 6.22 20.7C6.15 20.71 6.08 20.71 6 20.71C5.35 20.71 4.73 20.44 4.28 19.99C3.83 19.54 3.55 18.92 3.55 18.27C3.55 17.62 3.83 17 4.28 16.55C4.73 16.1 5.35 15.82 6 15.82C6.08 15.82 6.15 15.83 6.22 15.84C8.6 16 10.8 15.13 12.38 13.54C13.97 11.95 14.84 9.75 14.68 7.38C14.67 7.3 14.67 7.23 14.67 7.15C14.67 6.5 14.95 5.88 15.4 5.43C15.85 4.98 16.47 4.7 17.12 4.7C17.77 4.7 18.4 4.98 18.85 5.43C19.3 5.88 19.58 6.5 19.58 7.15C19.58 7.23 19.57 7.3 19.56 7.38C19.55 7.57 19.54 7.77 19.53 7.96C19.5 7.99 19.47 8 19.44 8C19.06 8.01 18.92 8.01 18.92 8.01Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2ZM7.6 4C5.61 4 4 5.61 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4C18.39 20 20 18.39 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6ZM17.25 5.5C17.94 5.5 18.5 6.06 18.5 6.75C18.5 7.44 17.94 8 17.25 8C16.56 8 16 7.44 16 6.75C16 6.06 16.56 5.5 17.25 5.5ZM12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7ZM12 9C10.35 9 9 10.35 9 12C9 13.65 10.35 15 12 15C13.65 15 15 13.65 15 12C15 10.35 13.65 9 12 9Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 