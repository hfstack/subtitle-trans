"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSubtitleContext } from '@/contexts/SubtitleContext';

interface SubtitleUploaderProps {
  onSubtitleLoaded?: (content: string) => void;
}

const SubtitleUploader: React.FC<SubtitleUploaderProps> = ({ onSubtitleLoaded }) => {
  const t = useTranslations('actions');
  const [isUploading, setIsUploading] = useState(false);
  const { setSubtitleContent } = useSubtitleContext();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const content = await readFileContent(file);
      setSubtitleContent(content);
      
      if (onSubtitleLoaded) {
        onSubtitleLoaded(content);
      }
    } catch (error) {
      console.error('读取文件失败:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">{t('clickToUpload')}</span>
            </p>
            <p className="text-xs text-gray-500">.SRT, .VTT, .ASS, .SSA</p>
          </div>
          <input 
            id="dropzone-file" 
            type="file" 
            className="hidden" 
            accept=".srt,.vtt,.ass,.ssa"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
      {isUploading && (
        <div className="mt-4 text-center text-sm text-gray-500">
          {t('uploading')}...
        </div>
      )}
    </div>
  );
};

export default SubtitleUploader; 