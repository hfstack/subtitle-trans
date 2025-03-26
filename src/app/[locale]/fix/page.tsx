import React from 'react';
import SubtitleRepairForm from '@/components/subtitle/SubtitleRepairForm';

export const metadata = {
  title: '字幕修复 | AI字幕助手',
  description: '使用AI技术自动识别并修复错误的字幕内容，提高字幕质量和准确度',
};

export default function FixPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">字幕修复</h1>
      <p className="mb-8 text-gray-600">
        上传您的字幕文件，我们的AI将自动识别并修复错误，提高字幕质量和准确度。
      </p>
      
      <SubtitleRepairForm />
    </div>
  );
} 