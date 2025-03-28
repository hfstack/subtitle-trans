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
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">{t('translateOptions')}</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                <span className="font-medium">{t('optimizeLength')}</span>
                <p className="mt-1 text-sm">
                  此选项会尽量使翻译后的文本长度与原文相近，使朗读时长接近，同时保持语序不变，确保字幕与视频同步。
                </p>
              </li>
              <li>
                <span className="font-medium">{t('reduceWordCount')}</span>
                <p className="mt-1 text-sm">
                  此选项会在保持原意的情况下减少单词数量，使字幕更加简洁，适合快节奏的视频或空间有限的显示场景。
                </p>
              </li>
              <li>
                <span className="font-medium">{t('preserveEmojis')}</span>
                <p className="mt-1 text-sm">
                  翻译过程中会保留原文中的所有表情符号，确保视觉表达不会丢失。
                </p>
              </li>
              <li>
                <span className="font-medium">{t('autoLineBreak')}</span>
                <p className="mt-1 text-sm">
                  对于较长的字幕内容，会在适当位置自动添加换行，确保每行不超过40个字符，提高可读性。
                </p>
              </li>
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