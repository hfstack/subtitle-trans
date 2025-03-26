import React from 'react';
import SubtitleTTSForm from '@/components/subtitle/SubtitleTTSForm';

export const metadata = {
  title: '转语音 | AI字幕助手',
  description: '使用AI技术将字幕文本转换为自然流畅的语音，支持多种语言和声音风格',
};

export default function TTSPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">转语音</h1>
      <p className="mb-8 text-gray-600">
        上传您的字幕文件，选择语音风格，我们的AI将为您生成自然流畅的语音。
      </p>
      
      <SubtitleTTSForm />
    </div>
  );
} 