"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '../common/Button';
import { useSubtitleContext } from '@/contexts/SubtitleContext';

interface SubtitleRepairFormProps {
  initialContent?: string;
  onComplete?: (content: string) => void;
}

const SubtitleRepairForm: React.FC<SubtitleRepairFormProps> = ({ initialContent, onComplete }) => {
  const t = useTranslations('actions');
  const featuresT = useTranslations('features');
  const { subtitleContent, setSubtitleContent, subtitleFile, clearSubtitle } = useSubtitleContext();
  const [repairLevel, setRepairLevel] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [repairedContent, setRepairedContent] = useState<string>('');
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content) return;
    
    setIsProcessing(true);
    setError(null);
    setStreamingResult('');
    
    // 创建新的 AbortController 用于取消请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    try {
      // 准备请求参数
      const options = {
        correctGrammar: repairLevel === 'standard' || repairLevel === 'deep',
        fixPunctuation: true,
        improvePhrasing: repairLevel === 'deep',
        ensureConsistency: repairLevel === 'deep'
      };
      
      // 发送API请求
      const response = await fetch('/api/repair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          ...options
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
            setStreamingResult(accumulatedResult);
          }
        }
        
        // 流式响应完成后设置最终结果
        setResult(accumulatedResult);
        setRepairedContent(accumulatedResult);
        
        // 如果有onComplete回调，则调用
        if (onComplete) {
          onComplete(accumulatedResult);
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
      
      console.error('修复失败:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };
  
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    // 确保状态正确重置
    setIsProcessing(false);
    setStreamingResult('');
  };
  
  const handleDownload = () => {
    if (!result) return;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = subtitleFile ? `repaired_${subtitleFile.name}` : 'repaired_subtitle.srt';
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
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {featuresT('repairLevel')}
          </label>
          <select
            value={repairLevel}
            onChange={(e) => setRepairLevel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={isProcessing}
          >
            <option value="light">{featuresT('repairLevelLight')}</option>
            <option value="standard">{featuresT('repairLevelStandard')}</option>
            <option value="deep">{featuresT('repairLevelDeep')}</option>
          </select>
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
            {featuresT('repairInProgress')}
            <span className="inline-block ml-2 animate-pulse">...</span>
          </h3>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
            {streamingResult}
          </pre>
        </div>
      )}
      
      {/* 最终结果 */}
      {!isProcessing && result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{featuresT('repairResult')}</h3>
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

export default SubtitleRepairForm; 