"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';

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
  
  // 当初始文件变化时更新状态
  useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
      setResult(null);
      setAudioUrl(null);
      setProcessingMode(null);
    }
  }, [initialFile]);
  
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setResult(null);
    setAudioUrl(null);
    setProcessingMode(null);
  };
  
  const handleModeSelect = (mode: ProcessingMode) => {
    setProcessingMode(mode);
    setResult(null);
    setAudioUrl(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !processingMode) return;
    
    setIsProcessing(true);
    
    try {
      // 这里应该是实际的API调用
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 根据不同模式返回不同结果
      switch (processingMode) {
        case 'translate':
          setResult(`
1
00:00:01,000 --> 00:00:04,000
这是翻译后的字幕示例

2
00:00:05,000 --> 00:00:08,000
AI翻译非常智能和准确
          `);
          break;
        case 'emoji':
          setResult(`
1
00:00:01,000 --> 00:00:04,000
这是添加表情后的字幕示例 😊

2
00:00:05,000 --> 00:00:08,000
AI添加的表情非常生动有趣 🎉
          `);
          break;
        case 'fix':
          setResult(`
1
00:00:01,000 --> 00:00:04,000
这是修复后的字幕示例

2
00:00:05,000 --> 00:00:08,000
AI修复后的字幕更加准确流畅
          `);
          break;
        case 'tts':
          setResult('字幕已成功转换为语音');
          setAudioUrl('https://example.com/sample-audio.mp3');
          break;
      }
    } catch (error) {
      console.error('处理失败:', error);
      setResult('处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (!result || !processingMode) return;
    
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