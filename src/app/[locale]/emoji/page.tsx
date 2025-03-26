import React from 'react';
import SubtitleEmojiForm from '@/components/subtitle/SubtitleEmojiForm';

export const metadata = {
  title: '添加表情 | AI字幕助手',
  description: '使用AI技术智能分析字幕内容，在适当位置添加表情符号，使字幕更加生动有趣',
};

export default function EmojiPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">添加表情</h1>
      <p className="mb-8 text-gray-600">
        上传您的字幕文件，我们的AI将智能分析内容并添加适当的表情符号，使字幕更加生动有趣。
      </p>
      
      <SubtitleEmojiForm />
    </div>
  );
} 