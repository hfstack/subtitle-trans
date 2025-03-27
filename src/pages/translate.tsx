import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import SubtitleTranslateForm from '../components/subtitle/SubtitleTranslateForm';
import SubtitleUploader from '../components/subtitle/SubtitleUploader';
import { useSubtitleContext } from '../contexts/SubtitleContext';

const TranslatePage: React.FC = () => {
  const { subtitleContent } = useSubtitleContext();

  return (
    <MainLayout title="字幕翻译 - 字幕工具箱">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-lg font-medium leading-6 text-gray-900">字幕翻译</h1>
          <div className="mt-5">
            <SubtitleUploader />
            {subtitleContent && <SubtitleTranslateForm />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TranslatePage; 