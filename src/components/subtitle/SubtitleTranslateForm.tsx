"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Button from '../common/Button';
import { useSubtitleContext } from '@/contexts/SubtitleContext';
import { parseSRT, formatToSRT, SubtitleEntry, entriesToText, applyTextToEntries } from '@/utils/subtitleUtils';

interface SubtitleTranslateFormProps {
  initialContent?: string;
  onComplete?: (content: string) => void;
}

const SubtitleTranslateForm: React.FC<SubtitleTranslateFormProps> = ({ initialContent, onComplete }) => {
  const t = useTranslations('actions');
  const featuresT = useTranslations('features');
  const { subtitleContent, subtitleFile, clearSubtitle } = useSubtitleContext();
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('zh');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [originalEntries, setOriginalEntries] = useState<SubtitleEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [streamingResult, setStreamingResult] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const [optimizeLength, setOptimizeLength] = useState(true);
  const [reduceWordCount, setReduceWordCount] = useState(false);
  
  // 使用传入的initialContent或者上下文中的subtitleContent
  const content = initialContent || subtitleContent;
  
  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  // 当内容变化时解析字幕
  useEffect(() => {
    if (content) {
      try {
        const entries = parseSRT(content);
        setOriginalEntries(entries);
      } catch (err) {
        console.error('解析字幕文件失败:', err);
        setError(t('fileReadError'));
      }
    }
  }, [content, t]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content || originalEntries.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    setStreamingResult('');
    
    try {
      // 将字幕条目转换为纯文本，用于发送到API
      const textForApi = entriesToText(originalEntries);
      
      // 创建新的AbortController
      abortControllerRef.current = new AbortController();
      
      // 发送API请求
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textForApi,
          sourceLang: sourceLanguage,
          targetLang: targetLanguage,
          preserveFormatting: true,
          optimizeLength: optimizeLength,
          reduceWordCount: reduceWordCount
        }),
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      // 处理流式响应
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accumulatedResult = '';
        
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          
          if (value) {
            const textChunk = decoder.decode(value, { stream: !done });
            accumulatedResult += textChunk;
            
            // 实时将API返回的文本应用到原始字幕条目并格式化
            try {
              const tempEntries = applyTextToEntries(originalEntries, accumulatedResult);
              const formattedStreamingResult = formatToSRT(tempEntries);
              setStreamingResult(formattedStreamingResult);
            } catch (err) {
              // 如果格式化失败，则显示原始文本
              setStreamingResult(accumulatedResult.replace(/\|\|\|\|/g, '\n\n'));
            }
          }
        }
        
        // 流式响应完成后设置最终结果
        // 将API返回的文本应用到原始字幕条目
        const updatedEntries = applyTextToEntries(originalEntries, accumulatedResult);
        
        // 确保时间戳被正确保留
        updatedEntries.forEach((entry, index) => {
          if (originalEntries[index]) {
            entry.startTime = originalEntries[index].startTime;
            entry.endTime = originalEntries[index].endTime;
          }
        });
        
        // 格式化为SRT
        const formattedResult = formatToSRT(updatedEntries);
        setResult(formattedResult);
        
        // 如果有onComplete回调，则调用
        if (onComplete) {
          onComplete(formattedResult);
        }
      } else {
        // 如果响应没有body，则尝试解析JSON响应
        const data = await response.json();
        if (data.translatedText) {
          // 将API返回的文本应用到原始字幕条目
          const updatedEntries = applyTextToEntries(originalEntries, data.translatedText);
          
          // 格式化为SRT
          const formattedResult = formatToSRT(updatedEntries);
          setResult(formattedResult);
          
          // 如果有onComplete回调，则调用
          if (onComplete) {
            onComplete(formattedResult);
          }
        } else {
          throw new Error('API返回的数据格式不正确');
        }
      }
    } catch (error) {
      console.error('翻译失败:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };
  
  const handleDownload = () => {
    if (!result) return;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = subtitleFile ? `${subtitleFile.name.replace(/\.[^/.]+$/, '')}_translated.srt` : 'translated_subtitle.srt';
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
      {/* 显示已上传的文件信息 */}
      {subtitleFile && (
        <div className="mb-6 bg-blue-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-blue-800">{t('uploadedFile')}</h3>
              <p className="mt-1 text-sm text-blue-700">
                {subtitleFile.name} ({(subtitleFile.size / 1024).toFixed(2)} KB)
              </p>
            </div>
            <button 
              onClick={clearSubtitle}
              className="text-gray-400 hover:text-gray-500"
              title={t('remove')}
            >
              <span className="text-xl font-bold">×</span>
            </button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {featuresT('sourceLanguage')}
            </label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isProcessing}
            >
              <option value="auto">{featuresT('autoDetect')}</option>
              <option value="zh">{featuresT('chinese')}</option>
              <option value="en">{featuresT('english')}</option>
              <option value="ja">{featuresT('japanese')}</option>
              <option value="ko">{featuresT('korean')}</option>
              <option value="fr">{featuresT('french')}</option>
              <option value="es">{featuresT('spanish')}</option>
              <option value="de">{featuresT('german')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {featuresT('targetLanguage')}
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isProcessing}
            >
              <option value="zh">{featuresT('chinese')}</option>
              <option value="en">{featuresT('english')}</option>
              <option value="ja">{featuresT('japanese')}</option>
              <option value="ko">{featuresT('korean')}</option>
              <option value="fr">{featuresT('french')}</option>
              <option value="es">{featuresT('spanish')}</option>
              <option value="de">{featuresT('german')}</option>
              <option value="zh-en">中英双语 / Chinese-English</option>
              <option value="zh-ja">中日双语 / Chinese-Japanese</option>
              <option value="zh-fr">中法双语 / Chinese-French</option>
              <option value="zh-es">中西双语 / Chinese-Spanish</option>
              <option value="en-zh">英中双语 / English-Chinese</option>
              <option value="en-ja">英日双语 / English-Japanese</option>
              <option value="en-fr">英法双语 / English-French</option>
              <option value="en-es">英西双语 / English-Spanish</option>
              <option value="auto-en">原文-英语 / Original-English</option>
              <option value="auto-zh">原文-中文 / Original-Chinese</option>
              <option value="auto-fr">原文-法语 / Original-French</option>
              <option value="auto-es">原文-西班牙语 / Original-Spanish</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">{featuresT('translateOptions')}</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="optimizeLength"
                type="checkbox"
                checked={optimizeLength}
                onChange={(e) => setOptimizeLength(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isProcessing}
              />
              <label htmlFor="optimizeLength" className="ml-2 block text-sm text-gray-700">
                {featuresT('optimizeLength')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="reduceWordCount"
                type="checkbox"
                checked={reduceWordCount}
                onChange={(e) => setReduceWordCount(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isProcessing}
              />
              <label htmlFor="reduceWordCount" className="ml-2 block text-sm text-gray-700">
                {featuresT('reduceWordCount')}
              </label>
            </div>
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
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* 流式输出结果 */}
      {isProcessing && streamingResult && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            {t('processing')}
            <span className="inline-block ml-2 animate-pulse">...</span>
          </h3>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
            {streamingResult}
          </pre>
        </div>
      )}
      
      {result && !isProcessing && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{featuresT('translateTarget')}</h3>
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

export default SubtitleTranslateForm;