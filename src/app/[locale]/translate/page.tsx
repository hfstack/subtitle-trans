import React from 'react';
import SubtitleTranslateForm from '@/components/subtitle/SubtitleTranslateForm';

export const metadata = {
  title: '字幕翻译 | AI字幕助手',
  description: '使用AI技术将字幕翻译成多种语言，保持原意的同时流畅自然',
};

export default function TranslatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">字幕翻译</h1>
      <p className="mb-8 text-gray-600">
        上传您的字幕文件，选择目标语言，我们的AI将为您提供高质量的翻译结果。
      </p>
      
      <SubtitleTranslateForm />
    </div>
  );
} 