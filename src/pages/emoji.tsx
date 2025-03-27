import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import SubtitleEmojiForm from '../components/subtitle/SubtitleEmojiForm';
import SubtitleUploader from '../components/subtitle/SubtitleUploader';
import { useSubtitleContext } from '../contexts/SubtitleContext';

const EmojiPage: React.FC = () => {
  const { subtitleContent } = useSubtitleContext();

  return (
    <MainLayout title="添加表情 - 字幕工具箱">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-lg font-medium leading-6 text-gray-900">添加表情</h1>
          <div className="mt-5">
            <SubtitleUploader />
            {subtitleContent && <SubtitleEmojiForm />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmojiPage; 