"use client";

import React, { useState } from 'react';
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
  
  // 使用传入的initialContent或者上下文中的subtitleContent
  const content = initialContent || subtitleContent;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content) return;
    
    setIsProcessing(true);
    setError(null);
    
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
      });
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // 设置修复后的内容
      setResult(data.repairedText);
      setRepairedContent(data.repairedText);
      
      // 如果有onComplete回调，则调用
      if (onComplete) {
        onComplete(data.repairedText);
      }
    } catch (error) {
      console.error('修复失败:', error);
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
          >
            <option value="light">{featuresT('repairLevelLight')}</option>
            <option value="standard">{featuresT('repairLevelStandard')}</option>
            <option value="deep">{featuresT('repairLevelDeep')}</option>
          </select>
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
      
      {result && (
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