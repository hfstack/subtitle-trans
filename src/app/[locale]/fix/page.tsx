"use client";

import React from 'react';
// import MainLayout from '@/components/layout/MainLayout';
import SubtitleRepairForm from '@/components/subtitle/SubtitleRepairForm';
import SubtitleUploader from '@/components/subtitle/SubtitleUploader';
import { useSubtitleContext } from '@/contexts/SubtitleContext';
import { useTranslations } from 'next-intl';

const FixPage = () => {
  const { subtitleContent } = useSubtitleContext();
  const t = useTranslations('features');

  return (
    // 移除 MainLayout 包装
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h1 className="text-lg font-medium leading-6 text-gray-900">{t('fix')}</h1>
        <div className="mt-5">
          <SubtitleUploader />
          {subtitleContent && <SubtitleRepairForm />}
        </div>
      </div>
    </div>
  );
};

export default FixPage; 