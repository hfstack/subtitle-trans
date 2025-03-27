"use client";

import React from 'react';
// import MainLayout from '@/components/layout/MainLayout';
import SubtitleTTSForm from '@/components/subtitle/SubtitleTTSForm';
import SubtitleUploader from '@/components/subtitle/SubtitleUploader';
import { useSubtitleContext } from '@/contexts/SubtitleContext';

const TTSPage = () => {
  const { subtitleContent } = useSubtitleContext();

  return (
    // 移除 MainLayout 包装
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h1 className="text-lg font-medium leading-6 text-gray-900">字幕转语音</h1>
        <div className="mt-5">
          <SubtitleUploader />
          {subtitleContent && <SubtitleTTSForm />}
        </div>
      </div>
    </div>
  );
};

export default TTSPage; 