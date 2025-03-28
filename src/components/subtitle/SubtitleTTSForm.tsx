"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '../common/Button';
import { useSubtitleContext } from '@/contexts/SubtitleContext';

const SubtitleTTSForm = () => {
  const t = useTranslations('actions');
  const featuresT = useTranslations('features');
  const { subtitleContent, subtitleFile } = useSubtitleContext();
  
  const [language, setLanguage] = useState('zh');
  const [voice, setVoice] = useState('female1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 显示功能开发中的提示
    setError(featuresT('ttsInDevelopment'));
    return;
    
    // 以下代码暂时不会执行
    if (!subtitleContent) {
      setError(featuresT('noSubtitleContent'));
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // API调用逻辑
    } catch (error) {
      console.error('转换失败:', error);
      setError(t('fileReadError'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  // 如果没有字幕文件，显示提示信息
  if (!subtitleFile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-center text-gray-500">
          {featuresT('noSubtitleContent')}
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 显示已上传的文件信息 */}
      <div className="mb-6 bg-blue-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-blue-800">{t('uploadedFile')}</h3>
            <p className="mt-1 text-sm text-blue-700">
              {subtitleFile.name} ({(subtitleFile.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {featuresT('sourceLanguage')}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isProcessing}
            >
              <option value="zh">{featuresT('chinese')}</option>
              <option value="en">{featuresT('english')}</option>
              <option value="ja">{featuresT('japanese')}</option>
              <option value="ko">{featuresT('korean')}</option>
              <option value="fr">{featuresT('french')}</option>
              <option value="de">{featuresT('german')}</option>
              <option value="es">{featuresT('spanish')}</option>
              <option value="ru">Russian</option>
              <option value="pt">Portuguese</option>
              <option value="it">Italian</option>
              <option value="nl">Dutch</option>
              <option value="pl">Polish</option>
              <option value="tr">Turkish</option>
              <option value="ar">Arabic</option>
              <option value="hi">Hindi</option>
              <option value="th">Thai</option>
              <option value="vi">Vietnamese</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {featuresT('voiceType')}
            </label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isProcessing}
            >
              <optgroup label={featuresT('female')}>
                <option value="female1">{featuresT('femaleClear')}</option>
                <option value="female2">{featuresT('femaleSoft')}</option>
                <option value="female3">{featuresT('femaleWarm')}</option>
                <option value="female4">{featuresT('femaleLively')}</option>
                <option value="female5">{featuresT('femaleGentle')}</option>
              </optgroup>
              <optgroup label={featuresT('male')}>
                <option value="male1">{featuresT('maleDeep')}</option>
                <option value="male2">{featuresT('maleNatural')}</option>
                <option value="male3">{featuresT('maleProfessional')}</option>
                <option value="male4">{featuresT('maleWarm')}</option>
                <option value="male5">{featuresT('maleCasual')}</option>
              </optgroup>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            type="submit" 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? t('processing') : t('process')}
          </Button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{t('processed')}</h3>
          <p className="mb-4">{result}</p>
          
          {audioUrl && (
            <div className="mt-4">
              <audio controls className="w-full">
                <source src={audioUrl} type="audio/mpeg" />
                {featuresT('ttsInDevelopment')}
              </audio>
              
              <div className="mt-4 flex space-x-4">
                <Button onClick={() => window.open(audioUrl, '_blank')}>
                  {t('download')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubtitleTTSForm; 