"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';

const SubtitleEmojiForm = () => {
  const t = useTranslations('actions');
  const [file, setFile] = useState<File | null>(null);
  const [emojiDensity, setEmojiDensity] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
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
这是添加表情后的字幕示例 😊

2
00:00:05,000 --> 00:00:08,000
AI添加的表情非常生动有趣 🎉
      `);
    } catch (error) {
      console.error('处理失败:', error);
      setResult('处理失败，请重试');
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
    a.download = 'emoji_subtitle.srt';
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