"use client";

import React from 'react';
// import MainLayout from '@/components/layout/MainLayout';
import SubtitleTranslateForm from '@/components/subtitle/SubtitleTranslateForm';
import SubtitleUploader from '@/components/subtitle/SubtitleUploader';
import { useSubtitleContext } from '@/contexts/SubtitleContext';
import { useTranslations } from 'next-intl';

const TranslatePage = () => {
  const { subtitleContent } = useSubtitleContext();
  const t = useTranslations('features');
  const commonT = useTranslations('common');

  return (
    <div className="space-y-8">
      {/* 上传功能部分 */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">{commonT('startUsing')}</h2>
          <div className="mt-2">
            <SubtitleUploader />
            {subtitleContent && <SubtitleTranslateForm />}
          </div>
        </div>
      </div>
      
      {/* 功能介绍部分 */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('translate')}</h1>
          <p className="text-gray-600 mb-4">{t('translateDescription')}</p>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">{commonT('features')}</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>{t('translateFeature1')}</li>
              <li>{t('translateFeature2')}</li>
              <li>{t('translateFeature3')}</li>
              <li>{t('translateFeature4')}</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-2">{commonT('examples')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border border-gray-200">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{t('translateSource')}</h3>
                <p className="text-gray-700 text-sm">{t('translateSourceExample')}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{t('translateTarget')}</h3>
                <p className="text-gray-700 text-sm">{t('translateTargetExample')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatePage; 