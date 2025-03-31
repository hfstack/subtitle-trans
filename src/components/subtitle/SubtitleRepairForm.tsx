"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '../common/Button';
import { useSubtitleContext } from '@/contexts/SubtitleContext';
import { compareSubtitles, formatSubtitleForDisplay, highlightDifferences } from '@/utils/subtitleUtils';

interface SubtitleRepairFormProps {
  initialContent?: string;
  onComplete?: (content: string) => void;
}

const SubtitleRepairForm: React.FC<SubtitleRepairFormProps> = ({ initialContent, onComplete }) => {
  const t = useTranslations('actions');
  const featuresT = useTranslations('features');
  const { subtitleFile, clearSubtitle, subtitleContent } = useSubtitleContext();

  const [repairLevel, setRepairLevel] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamingResult, setStreamingResult] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<{
    originalEntries: string[];
    repairedEntries: { text: string; isModified: boolean }[];
  } | null>(null);
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
    setComparisonResult(null);
    
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
        
        // 生成比较结果
        const comparison = compareSubtitles(content, accumulatedResult);
        setComparisonResult(comparison);
        
        // 如果有onComplete回调，则调用
        if (onComplete) {
          // 移除[MODIFIED]标记后再传递
          const cleanResult = accumulatedResult.replace(/\[MODIFIED\]/g, '');
          onComplete(cleanResult);
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
    
    // 移除[MODIFIED]标记后再下载
    const cleanResult = result.replace(/\[MODIFIED\]/g, '');
    
    const blob = new Blob([cleanResult], { type: 'text/plain' });
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
    
    // 移除[MODIFIED]标记后再复制
    const cleanResult = result.replace(/\[MODIFIED\]/g, '');
    
    navigator.clipboard.writeText(cleanResult)
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
            {streamingResult.replace(/\[MODIFIED\]/g, '')}
          </pre>
        </div>
      )}
      
      {/* 最终结果 - 对比视图 */}
      {!isProcessing && comparisonResult && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{featuresT('repairResult')}</h3>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">{featuresT('comparisonView')}</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-yellow-200 mr-1"></span>
                    <span className="text-xs text-gray-600">{featuresT('modified')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-gray-100 mr-1"></span>
                    <span className="text-xs text-gray-600">{featuresT('unchanged')}</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                {comparisonResult.originalEntries.map((original, index) => {
                  const repaired = comparisonResult.repairedEntries[index];
                  const isModified = repaired?.isModified || false;
                  
                  return (
                    <div key={index} className={`border-b last:border-b-0 ${isModified ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                      <div className="grid grid-cols-2 divide-x">
                        <div className="p-3">
                          <h5 className="text-xs font-medium text-gray-500 mb-1">{featuresT('original')}</h5>
                          <p 
                            className="text-sm text-gray-800 whitespace-pre-wrap" 
                            dangerouslySetInnerHTML={{ __html: formatSubtitleForDisplay(original) }}
                          ></p>
                        </div>
                        <div className="p-3">
                          <h5 className="text-xs font-medium text-gray-500 mb-1">{featuresT('repaired')}</h5>
                          {isModified ? (
                            <div>
                              <p 
                                className="text-sm text-gray-800 whitespace-pre-wrap" 
                                dangerouslySetInnerHTML={{ 
                                  __html: formatSubtitleForDisplay(
                                    highlightDifferences(original, repaired?.text || '')
                                  ) 
                                }}
                              ></p>
                              <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                {featuresT('modified')}
                              </span>
                            </div>
                          ) : (
                            <p 
                              className="text-sm text-gray-800 whitespace-pre-wrap" 
                              dangerouslySetInnerHTML={{ __html: formatSubtitleForDisplay(repaired?.text || '') }}
                            ></p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-4 flex space-x-4">
              <Button onClick={handleDownload}>
                {t('download')}
              </Button>
              <Button variant="secondary" onClick={handleCopy}>
                {t('copy')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtitleRepairForm; 