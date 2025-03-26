"use client";

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/common/Button';
import { parseSubtitle, ParsedSubtitle } from '@/lib/subtitle/parser';

type SubtitleUploaderProps = {
  onSubtitleLoaded: (subtitle: ParsedSubtitle) => void;
};

const SubtitleUploader = ({ onSubtitleLoaded }: SubtitleUploaderProps) => {
  const t = useTranslations();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const processFile = (file: File) => {
    setFileName(file.name);
    setError('');
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const subtitle = parseSubtitle(content);
        onSubtitleLoaded(subtitle);
      } catch (err) {
        setError('无法解析字幕文件，请确保格式正确');
        console.error(err);
      }
    };
    
    reader.onerror = () => {
      setError('读取文件时发生错误');
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="mb-8">
      <div
        className={`border-2 border-dashed p-8 rounded-lg text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".srt,.vtt,.ass,.ssa"
          onChange={handleFileChange}
        />
        
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <p className="text-lg mb-2">
          {fileName ? fileName : t('actions.upload')}
        </p>
        <p className="text-sm text-gray-500">
          拖放文件到此处，或点击选择文件<br />
          支持 .srt, .vtt, .ass 格式
        </p>
      </div>
      
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SubtitleUploader; 