"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import { parseSRT, formatToSRT, entriesToText, applyTextToEntries, SubtitleEntry } from '@/utils/subtitleUtils';

const SubtitleEmojiForm = () => {
  const t = useTranslations('actions');
  const featuresT = useTranslations('features');
  const [file, setFile] = useState<File | null>(null);
  const [emojiDensity, setEmojiDensity] = useState('medium');
  const [emojiPosition, setEmojiPosition] = useState('inline');
  const [emojiStyle, setEmojiStyle] = useState('modern');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [originalEntries, setOriginalEntries] = useState<SubtitleEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = async (selectedFile: File | null) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
    
    if (selectedFile) {
      try {
        const content = await readFileContent(selectedFile);
        const entries = parseSRT(content);
        setOriginalEntries(entries);
      } catch (err) {
        console.error('解析字幕文件失败:', err);
        setError(t('fileReadError'));
      }
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || originalEntries.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // 将字幕条目转换为纯文本，用于发送到API
      const textForApi = entriesToText(originalEntries);
      
      // 发送API请求
      const response = await fetch('/api/emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textForApi,
          density: emojiDensity,
          position: emojiPosition,
          style: emojiStyle
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // 将API返回的文本应用到原始字幕条目
      const updatedEntries = applyTextToEntries(originalEntries, data.processedText);
      
      // 格式化为SRT
      const formattedResult = formatToSRT(updatedEntries);
      setResult(formattedResult);
    } catch (error) {
      console.error('处理失败:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (!result) return;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `${file.name.replace(/\.[^/.]+$/, '')}_emoji.srt` : 'emoji_subtitle.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleCopy = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result)
      .then(() => alert(t('copySuccess')))
      .catch(err => console.error('复制失败:', err));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <FileUpload 
          onFileChange={handleFileChange} 
          accept=".srt,.vtt,.ass,.ssa"
          label={t('upload')}
        />
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {file && (
          <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {featuresT('emojiDensity')}
                </label>
                <select
                  value={emojiDensity}
                  onChange={(e) => setEmojiDensity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="low">{featuresT('emojiDensityLow')}</option>
                  <option value="medium">{featuresT('emojiDensityMedium')}</option>
                  <option value="high">{featuresT('emojiDensityHigh')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {featuresT('emojiPosition')}
                </label>
                <select
                  value={emojiPosition}
                  onChange={(e) => setEmojiPosition(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="start">{featuresT('emojiPositionStart')}</option>
                  <option value="end">{featuresT('emojiPositionEnd')}</option>
                  <option value="inline">{featuresT('emojiPositionInline')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {featuresT('emojiStyle')}
                </label>
                <select
                  value={emojiStyle}
                  onChange={(e) => setEmojiStyle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="modern">{featuresT('emojiStyleModern')}</option>
                  <option value="classic">{featuresT('emojiStyleClassic')}</option>
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
          </>
        )}
      </form>
      
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{featuresT('emojiResult')}</h3>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
            {result}
          </pre>
          
          <div className="mt-4 flex space-x-4">
            <Button onClick={handleDownload}>
              {t('download')}
            </Button>
            <Button variant="secondary" onClick={handleCopy}>
              {t('copy')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtitleEmojiForm; 