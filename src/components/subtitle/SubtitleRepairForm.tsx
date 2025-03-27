"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import { useSubtitleContext } from '../contexts/SubtitleContext';

interface SubtitleRepairFormProps {
  initialContent?: string;
  onComplete?: (content: string) => void;
}

const SubtitleRepairForm: React.FC<SubtitleRepairFormProps> = ({ initialContent, onComplete }) => {
  const t = useTranslations('actions');
  const { subtitleContent, setSubtitleContent } = useSubtitleContext();
  const [file, setFile] = useState<File | null>(null);
  const [repairLevel, setRepairLevel] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [repairedContent, setRepairedContent] = useState<string>('');
  const [isRepairing, setIsRepairing] = useState<boolean>(false);
  
  // 使用传入的initialContent或者上下文中的subtitleContent
  const content = initialContent || subtitleContent;
  
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setResult(null);
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
      setResult(`
1
00:00:01,000 --> 00:00:04,000
这是修复后的字幕示例

2
00:00:05,000 --> 00:00:08,000
AI修复后的字幕更加准确流畅
      `);
      
      // 设置修复后的内容
      setRepairedContent(result);
      
      // 如果有onComplete回调，则调用
      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error('修复失败:', error);
      setResult('修复失败，请重试');
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
    a.download = 'repaired_subtitle.srt';
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
            
            <div className="mt-6">
              <Button 
                type="submit" 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? '修复中...' : t('process')}
              </Button>
            </div>
          </>
        )}
      </form>
      
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">修复结果</h3>
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