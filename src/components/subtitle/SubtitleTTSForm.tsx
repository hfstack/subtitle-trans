"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';

const SubtitleTTSForm = () => {
  const t = useTranslations('actions');
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('zh');
  const [voice, setVoice] = useState('female1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setResult(null);
    setAudioUrl(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      // 这里应该是实际的API调用
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟结果
      setResult('字幕已成功转换为语音');
      setAudioUrl('https://example.com/sample-audio.mp3');
    } catch (error) {
      console.error('转换失败:', error);
      setResult('转换失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <FileUpload 
          onFileChange={handleFileChange} 
          accept=".srt,.vtt,.ass,.ssa"
          label={t('upload')}
        />
        
        {file && (
          <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  语言
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="zh">中文</option>
                  <option value="en">英语</option>
                  <option value="ja">日语</option>
                  <option value="ko">韩语</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  声音
                </label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="female1">女声 1</option>
                  <option value="female2">女声 2</option>
                  <option value="male1">男声 1</option>
                  <option value="male2">男声 2</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                type="submit" 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? '处理中...' : t('process')}
              </Button>
            </div>
          </>
        )}
      </form>
      
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">处理结果</h3>
          <p className="mb-4">{result}</p>
          
          {audioUrl && (
            <div className="mt-4">
              <audio controls className="w-full">
                <source src={audioUrl} type="audio/mpeg" />
                您的浏览器不支持音频播放
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