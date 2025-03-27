"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import { parseSRT, formatToSRT, entriesToText, applyTextToEntries, SubtitleEntry } from '@/utils/subtitleUtils';

type ProcessingMode = 'translate' | 'emoji' | 'fix' | 'tts';

interface SubtitleProcessorProps {
  initialFile?: File | null;
}

const SubtitleProcessor: React.FC<SubtitleProcessorProps> = ({ initialFile = null }) => {
  const t = useTranslations();
  const actionT = useTranslations('actions');
  const featureT = useTranslations('features');
  
  // 文件状态
  const [file, setFile] = useState<File | null>(initialFile);
  const [processingMode, setProcessingMode] = useState<ProcessingMode | null>(null);
  
  // 处理选项
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('zh');
  const [emojiDensity, setEmojiDensity] = useState('medium');
  const [repairLevel, setRepairLevel] = useState('standard');
  const [voice, setVoice] = useState('female1');
  
  // 处理状态
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // 在组件中添加状态
  const [originalEntries, setOriginalEntries] = useState<SubtitleEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // 当初始文件变化时更新状态
  useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
      setResult(null);
      setAudioUrl(null);
      setProcessingMode(null);
    }
  }, [initialFile]);
  
  const handleFileChange = async (selectedFile: File | null) => {
    setFile(selectedFile);
    setResult(null);
    setAudioUrl(null);
    setProcessingMode(null);
    setError(null);
    
    if (selectedFile) {
      try {
        const content = await readFileContent(selectedFile);
        const entries = parseSRT(content);
        setOriginalEntries(entries);
      } catch (err) {
        console.error('解析字幕文件失败:', err);
        setError(actionT('fileReadError'));
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
  
  const handleModeSelect = (mode: ProcessingMode) => {
    setProcessingMode(mode);
    setResult(null);
    setAudioUrl(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !processingMode || originalEntries.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // 将字幕条目转换为纯文本，用于发送到API
      const textForApi = entriesToText(originalEntries);
      
      let apiEndpoint = '';
      let requestBody = {};
      
      // 根据不同模式设置不同的API端点和请求体
      switch (processingMode) {
        case 'translate':
          apiEndpoint = '/api/translate';
          requestBody = {
            text: textForApi,
            sourceLang: sourceLanguage,
            targetLang: targetLanguage,
            preserveFormatting: true
          };
          break;
        case 'emoji':
          apiEndpoint = '/api/emoji';
          requestBody = {
            text: textForApi,
            density: emojiDensity,
            position: 'inline',
            style: 'modern'
          };
          break;
        case 'fix':
          apiEndpoint = '/api/repair';
          requestBody = {
            text: textForApi,
            correctGrammar: repairLevel === 'standard' || repairLevel === 'deep',
            fixPunctuation: true,
            improvePhrasing: repairLevel === 'deep',
            ensureConsistency: repairLevel === 'deep'
          };
          break;
        case 'tts':
          apiEndpoint = '/api/tts';
          requestBody = {
            text: textForApi,
            voice: voice,
            speed: 1.0,
            pitch: 1.0
          };
          break;
      }
      
      // 发送API请求
      if (processingMode === 'tts') {
        // TTS需要特殊处理，因为它返回的是音频数据
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        // 创建音频URL
        const audioBlob = await response.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setResult('字幕已成功转换为语音');
      } else {
        // 其他处理模式
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // 获取API返回的处理后文本
        let processedText = '';
        if (processingMode === 'translate') {
          processedText = data.translatedText;
        } else if (processingMode === 'emoji') {
          processedText = data.processedText;
        } else if (processingMode === 'fix') {
          processedText = data.repairedText;
        }
        
        // 将API返回的文本应用到原始字幕条目
        const updatedEntries = applyTextToEntries(originalEntries, processedText);
        
        // 格式化为SRT
        const formattedResult = formatToSRT(updatedEntries);
        setResult(formattedResult);
      }
    } catch (error) {
      console.error('处理失败:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (!result) return;
    
    if (processingMode === 'tts' && audioUrl) {
      window.open(audioUrl, '_blank');
      return;
    }
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // 根据处理模式设置不同的文件名
    let fileName = 'processed_subtitle.srt';
    switch (processingMode) {
      case 'translate':
        fileName = 'translated_subtitle.srt';
        break;
      case 'emoji':
        fileName = 'emoji_subtitle.srt';
        break;
      case 'fix':
        fileName = 'fixed_subtitle.srt';
        break;
    }
    
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleCopy = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result)
      .then(() => alert('已复制到剪贴板'))
      .catch(err => console.error('复制失败:', err));
  };
  
  const renderOptions = () => {
    if (!processingMode) return null;
    
    switch (processingMode) {
      case 'translate':
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                源语言
              </label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="auto">自动检测</option>
                <option value="zh">中文</option>
                <option value="en">英语</option>
                <option value="ja">日语</option>
                <option value="ko">韩语</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标语言
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="zh">中文</option>
                <option value="en">英语</option>
                <option value="ja">日语</option>
                <option value="ko">韩语</option>
              </select>
            </div>
          </div>
        );
      
      case 'emoji':
        return (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              表情密度
            </label>
            <select
              value={emojiDensity}
              onChange={(e) => setEmojiDensity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="low">低 (偶尔添加)</option>
              <option value="medium">中 (适量添加)</option>
              <option value="high">高 (频繁添加)</option>
            </select>
          </div>
        );
      
      case 'fix':
        return (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              修复级别
            </label>
            <select
              value={repairLevel}
              onChange={(e) => setRepairLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="light">轻度 (仅修复明显错误)</option>
              <option value="standard">标准 (修复大部分问题)</option>
              <option value="deep">深度 (全面优化字幕)</option>
            </select>
          </div>
        );
      
      case 'tts':
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                语言
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
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
        );
      
      default:
        return null;
    }
  };
  
  const renderResult = () => {
    if (!result) return null;
    
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">处理结果</h3>
        
        {processingMode === 'tts' && audioUrl ? (
          <div>
            <p className="mb-4">{result}</p>
            <audio controls className="w-full mb-4">
              <source src={audioUrl} type="audio/mpeg" />
              您的浏览器不支持音频播放
            </audio>
          </div>
        ) : (
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm mb-4">
            {result}
          </pre>
        )}
        
        <div className="flex space-x-4">
          <Button onClick={handleDownload}>
            {actionT('download')}
          </Button>
          {processingMode !== 'tts' && (
            <Button variant="secondary" onClick={handleCopy}>
              {actionT('copy')}
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => {
              setResult(null);
              setAudioUrl(null);
              setProcessingMode(null);
            }}
          >
            {actionT('reset')}
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {!file ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">上传字幕文件</h2>
          <FileUpload 
            onFileChange={handleFileChange} 
            accept=".srt,.vtt,.ass,.ssa"
            label={actionT('upload')}
          />
        </div>
      ) : !processingMode ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">选择处理功能</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFile(null)}
            >
              更换文件
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-300"
              onClick={() => handleModeSelect('translate')}
            >
              <h3 className="font-semibold mb-2">{featureT('translate')}</h3>
              <p className="text-sm text-gray-600">{featureT('translateDescription')}</p>
            </div>
            
            <div 
              className="bg-green-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-green-300"
              onClick={() => handleModeSelect('emoji')}
            >
              <h3 className="font-semibold mb-2">{featureT('emoji')}</h3>
              <p className="text-sm text-gray-600">{featureT('emojiDescription')}</p>
            </div>
            
            <div 
              className="bg-yellow-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-yellow-300"
              onClick={() => handleModeSelect('fix')}
            >
              <h3 className="font-semibold mb-2">{featureT('fix')}</h3>
              <p className="text-sm text-gray-600">{featureT('fixDescription')}</p>
            </div>
            
            <div 
              className="bg-purple-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-purple-300"
              onClick={() => handleModeSelect('tts')}
            >
              <h3 className="font-semibold mb-2">{featureT('tts')}</h3>
              <p className="text-sm text-gray-600">{featureT('ttsDescription')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {processingMode === 'translate' && featureT('translate')}
                {processingMode === 'emoji' && featureT('emoji')}
                {processingMode === 'fix' && featureT('fix')}
                {processingMode === 'tts' && featureT('tts')}
              </h2>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setProcessingMode(null)}
                >
                  返回选择
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFile(null)}
                >
                  更换文件
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {renderOptions()}
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? '处理中...' : actionT('process')}
                </Button>
              </div>
            </form>
          </div>
          
          {renderResult()}
        </div>
      )}
    </div>
  );
};

export default SubtitleProcessor; 