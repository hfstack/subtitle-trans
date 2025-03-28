"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import SubtitleUploader from '@/components/subtitle/SubtitleUploader';
import SubtitleProcessForm from '@/components/subtitle/SubtitleProcessForm';
import { useSubtitleContext } from '@/contexts/SubtitleContext';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowToUse from '@/components/home/HowToUse';

const HomePage = () => {
  const { subtitleContent } = useSubtitleContext();
  const [processedContent, setProcessedContent] = useState<string>('');
  const t = useTranslations('home.workflow');
  
  const workflowSteps = [
    { icon: '📁', title: t('quickSteps.upload') },
    { icon: '✨', title: t('quickSteps.process') },
    { icon: '⬇️', title: t('quickSteps.download') },
  ];

  return (
    <div className="space-y-12">
      <Hero />
      
      {/* 工作流区域 */}
      <div id="workflow" className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-lg font-medium leading-6 text-gray-900">{t('title')}</h1>
          
          {/* 简要流程说明 */}
          <div className="mt-4 mb-8">
            <div className="flex justify-center space-x-8">
              {workflowSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="text-2xl">{step.icon}</div>
                  <span className="ml-2 text-sm text-gray-600">{step.title}</span>
                  {index < workflowSteps.length - 1 && (
                    <div className="ml-8 text-gray-400">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 内容区域 */}
          <div className="mt-8 w-full overflow-visible">
            {!subtitleContent ? (
              <SubtitleUploader />
            ) : (
              <SubtitleProcessForm />
            )}
          </div>
        </div>
      </div>
      
      <Features />
      <HowToUse />
    </div>
  );
};

export default HomePage; 