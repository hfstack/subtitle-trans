"use client";

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useSubtitleContext } from '@/contexts/SubtitleContext';

const SubtitleUploader: React.FC = () => {
  const t = useTranslations('actions');
  const { setSubtitleContent, setSubtitleFile, subtitleContent } = useSubtitleContext();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 检查文件类型
    const validExtensions = ['.srt', '.vtt', '.ass', '.ssa'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError(`${t('invalidFileType')} ${validExtensions.join(', ')}`);
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const content = await readFileContent(file);
      setSubtitleContent(content);
      setSubtitleFile(file);
    } catch (err) {
      console.error('Error reading file:', err);
      setError(t('fileReadError'));
    } finally {
      setIsUploading(false);
    }
  };
  
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  // 如果已经有字幕内容，不显示上传组件
  if (subtitleContent) {
    return null;
  }
  
  return (
    <div>
      <div 
        onClick={handleClick}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".srt,.vtt,.ass,.ssa"
          className="hidden"
        />
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          {isUploading ? t('uploading') : t('clickToUpload')}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          SRT, VTT, ASS, SSA
        </p>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default SubtitleUploader; 