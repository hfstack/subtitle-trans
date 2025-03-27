"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import { parseSRT, formatToSRT, entriesToText, applyTextToEntries, SubtitleEntry } from '@/utils/subtitleUtils';
import { useSubtitleContext } from '@/contexts/SubtitleContext';

interface SubtitleEmojiFormProps {
  initialContent?: string;
  onComplete?: (content: string) => void;
}

const SubtitleEmojiForm: React.FC<SubtitleEmojiFormProps> = ({ initialContent, onComplete }) => {
  const t = useTranslations('actions');
  const featuresT = useTranslations('features');
  const { subtitleContent, setSubtitleContent, subtitleFile, clearSubtitle } = useSubtitleContext();
  const [emojiDensity, setEmojiDensity] = useState('medium');
  const [emojiPosition, setEmojiPosition] = useState('inline');
  const [emojiStyle, setEmojiStyle] = useState('modern');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [originalEntries, setOriginalEntries] = useState<SubtitleEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [streamingResult, setStreamingResult] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);
  
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
    
    // 创建新的 AbortController 用于取消请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
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
            
            // 为了更好的显示效果，在流式显示时将分隔符替换为换行符
            setStreamingResult(accumulatedResult);
          }
        }
        
        // 流式响应完成后设置最终结果
        // 将API返回的文本应用到原始字幕条目
        const updatedEntries = applyTextToEntries(originalEntries, accumulatedResult);
        
        // 格式化为SRT
        const formattedResult = formatToSRT(updatedEntries);
        setResult(formattedResult);
        
        // 如果有onComplete回调，则调用
        if (onComplete) {
          onComplete(formattedResult);
        }
      }
    } catch (error) {
      // 忽略中止错误
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('请求被中止');
        // 确保状态正确重置
        setIsProcessing(false);
        setStreamingResult('');
        return;
      }
      
      console.error('处理失败:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };
  
  const handleCancel = () => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    } catch (error) {
      console.error('取消请求时出错:', error);
    } finally {
      // 确保状态正确重置
      setIsProcessing(false);
      setStreamingResult('');
    }
  };
  
  const handleDownload = () => {
    if (!result) return;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = subtitleFile ? `${subtitleFile.name.replace(/\.[^/.]+$/, '')}_emoji.srt` : 'emoji_subtitle.srt';
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
              {featuresT('emojiDensity')}
            </label>
            <select
              value={emojiDensity}
              onChange={(e) => setEmojiDensity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isProcessing}
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
              disabled={isProcessing}
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
              disabled={isProcessing}
            >
              <option value="modern">{featuresT('emojiStyleModern')}</option>
              <option value="classic">{featuresT('emojiStyleClassic')}</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          {!isProcessing ? (
            <Button 
              type="submit" 
              disabled={isProcessing}
              className="w-full"
            >
              {t('process')}
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={handleCancel}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {t('cancel')}
            </Button>
          )}
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
            {featuresT('emojiInProgress')}
            <span className="inline-block ml-2 animate-pulse">...</span>
          </h3>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
            {streamingResult.replace(/\|\|\|\|/g, '\n\n')}
          </pre>
        </div>
      )}
      
      {result && !isProcessing && (
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