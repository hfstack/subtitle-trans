"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SubtitleUploader from '@/components/subtitle/SubtitleUploader';
import SubtitleRepairForm from '@/components/subtitle/SubtitleRepairForm';
import SubtitleEmojiForm from '@/components/subtitle/SubtitleEmojiForm';
import SubtitleTranslateForm from '@/components/subtitle/SubtitleTranslateForm';
import SubtitleTTSForm from '@/components/subtitle/SubtitleTTSForm';
import { useSubtitleContext } from '@/contexts/SubtitleContext';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowToUse from '@/components/home/HowToUse';

const HomePage = () => {
  const { subtitleContent } = useSubtitleContext();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [processedContent, setProcessedContent] = useState<string>('');
  const t = useTranslations('home.workflow');
  
  const steps = [
    { title: t('step1.title'), component: <SubtitleUploader /> },
    { title: t('step2.title'), component: <SubtitleRepairForm onComplete={(content) => {
      setProcessedContent(content);
      setCurrentStep(2);
    }} /> },
    { title: t('step3.title'), component: <SubtitleEmojiForm initialContent={processedContent} onComplete={(content) => {
      setProcessedContent(content);
      setCurrentStep(3);
    }} /> },
    { title: t('step4.title'), component: <SubtitleTranslateForm initialContent={processedContent} onComplete={(content) => {
      setProcessedContent(content);
      setCurrentStep(4);
    }} /> },
    { title: t('step4.title'), component: <SubtitleTTSForm content={processedContent} /> }
  ];

  // 当上传字幕后自动进入第二步
  useEffect(() => {
    if (subtitleContent && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [subtitleContent, currentStep]);

  return (
    <div className="space-y-12">
      {/* 英雄区域 */}
      <Hero />
      
      {/* 工作流区域 */}
      <div id="workflow" className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-lg font-medium leading-6 text-gray-900">{t('title')}</h1>
          
          {/* 步骤指示器 */}
          <div className="mt-4">
            <nav className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className={`flex items-center ${index <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${index <= currentStep ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                    {index < currentStep ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium">{step.title}</span>
                  {index < steps.length - 1 && (
                    <div className="ml-4 flex-1 border-t border-gray-200" />
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* 当前步骤内容 */}
          <div className="mt-8">
            {steps[currentStep].component}
          </div>
        </div>
      </div>
      
      {/* 功能特点区域 */}
      <Features />
      
      {/* 使用指南区域 */}
      <HowToUse />
    </div>
  );
};

export default HomePage; 