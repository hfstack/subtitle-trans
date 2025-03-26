"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import FileUpload from '../common/FileUpload';
import SubtitleProcessor from '../subtitle/SubtitleProcessor';

const Hero = () => {
  const t = useTranslations('home.hero');
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };
  
  return (
    <section className="py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">{t('subtitle')}</p>
        
        {!file ? (
          <div className="max-w-xl mx-auto">
            <FileUpload 
              onFileChange={handleFileChange}
              accept=".srt,.vtt,.ass,.ssa"
              label={t('uploadSubtitle')}
            />
          </div>
        ) : (
          <div className="mt-8">
            <SubtitleProcessor initialFile={file} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero; 