"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSubtitleContext } from '@/contexts/SubtitleContext';
import Button from '../common/Button';

interface ProcessOptions {
  repair: boolean;
  emoji: boolean;
  translate: boolean;
  tts: boolean;
}

interface ProcessSettings {
  repairLevel: string;
  fixPunctuation: boolean;
  fixGrammar: boolean;
  fixSpelling: boolean;
  emojiDensity: string;
  emojiStyle: string;
  emojiPosition: string;
  sourceLanguage: string;
  targetLanguage: string;
  preserveEmojis: boolean;
  optimizeLength: boolean;
  voice: string;
  speed: number;
  pitch: number;
  reduceWordCount: boolean;
}

interface ProcessResult {
  original: string;
  processed: string;
  changes: {
    repair?: boolean;
    emoji?: boolean;
    translate?: boolean;
  };
}

const SubtitleProcessForm = () => {
  const t = useTranslations('features');
  const actionsT = useTranslations('actions');
  const { subtitleContent } = useSubtitleContext();
  const [options, setOptions] = useState<ProcessOptions>({
    repair: true,
    emoji: true,
    translate: true,
    tts: false
  });

  const [settings, setSettings] = useState<ProcessSettings>({
    repairLevel: 'standard',
    fixPunctuation: true,
    fixGrammar: true,
    fixSpelling: true,
    emojiDensity: 'medium',
    emojiStyle: 'modern',
    emojiPosition: 'inline',
    sourceLanguage: 'auto',
    targetLanguage: 'zh',
    preserveEmojis: true,
    optimizeLength: true,
    voice: 'female1',
    speed: 1.0,
    pitch: 1.0,
    reduceWordCount: false
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processedText, setProcessedText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    setResult(null);
    setProcessedText('');
    setIsStreaming(true);

    try {
      // 验证是否至少选择了一个功能
      if (!options.repair && !options.emoji && !options.translate) {
        throw new Error(t('selectAtLeastOne'));
      }

      // 验证是否有字幕内容
      if (!subtitleContent) {
        throw new Error(t('noSubtitleContent'));
      }

      const response = await fetch('/api/subtitle/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: subtitleContent,
          options,
          settings,
        }),
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
            setProcessedText(accumulatedResult);
          }
        }

        // 流式响应完成后设置最终结果
        setResult({
          original: subtitleContent,
          processed: accumulatedResult,
          changes: {
            repair: options.repair,
            emoji: options.emoji,
            translate: options.translate
          }
        });
      }
    } catch (err) {
      console.error('处理错误:', err);
      setError(err instanceof Error ? err.message : t('processingError'));
    } finally {
      setIsProcessing(false);
      setIsStreaming(false);
    }
  };

  const handleDownload = () => {
    if (!result?.processed) return;
    
    const blob = new Blob([result.processed], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_subtitle.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleCopy = () => {
    if (!result?.processed) return;
    
    navigator.clipboard.writeText(result.processed)
      .then(() => alert(actionsT('copySuccess')))
      .catch(err => console.error('复制失败:', err));
  };

  const selectClassName = "w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900";

  const renderRepairOptions = () => (
    <div className="ml-8 mt-2 space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('repairLevel')}
        </label>
        <select
          value={settings.repairLevel}
          onChange={(e) => setSettings({...settings, repairLevel: e.target.value})}
          className={selectClassName}
        >
          <option value="light">{t('repairLevelLight')}</option>
          <option value="standard">{t('repairLevelStandard')}</option>
          <option value="deep">{t('repairLevelDeep')}</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="fixPunctuation"
            checked={settings.fixPunctuation}
            onChange={(e) => setSettings({...settings, fixPunctuation: e.target.checked})}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300"
          />
          <label htmlFor="fixPunctuation" className="ml-2 text-sm text-gray-700">
            {t('fixFeature2')}
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="fixGrammar"
            checked={settings.fixGrammar}
            onChange={(e) => setSettings({...settings, fixGrammar: e.target.checked})}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300"
          />
          <label htmlFor="fixGrammar" className="ml-2 text-sm text-gray-700">
            {t('fixFeature1')}
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="fixSpelling"
            checked={settings.fixSpelling}
            onChange={(e) => setSettings({...settings, fixSpelling: e.target.checked})}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300"
          />
          <label htmlFor="fixSpelling" className="ml-2 text-sm text-gray-700">
            {t('fixFeature4')}
          </label>
        </div>
      </div>
    </div>
  );

  const renderEmojiOptions = () => (
    <div className="ml-8 mt-2 space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('emojiDensity')}
        </label>
        <select
          value={settings.emojiDensity}
          onChange={(e) => setSettings({...settings, emojiDensity: e.target.value})}
          className={selectClassName}
        >
          <option value="low">{t('emojiDensityLow')}</option>
          <option value="medium">{t('emojiDensityMedium')}</option>
          <option value="high">{t('emojiDensityHigh')}</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('emojiPosition')}
        </label>
        <select
          value={settings.emojiPosition}
          onChange={(e) => setSettings({...settings, emojiPosition: e.target.value})}
          className={selectClassName}
        >
          <option value="start">{t('emojiPositionStart')}</option>
          <option value="inline">{t('emojiPositionInline')}</option>
          <option value="end">{t('emojiPositionEnd')}</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('emojiStyle')}
        </label>
        <select
          value={settings.emojiStyle}
          onChange={(e) => setSettings({...settings, emojiStyle: e.target.value})}
          className={selectClassName}
        >
          <option value="modern">{t('emojiStyleModern')}</option>
          <option value="classic">{t('emojiStyleClassic')}</option>
        </select>
      </div>
    </div>
  );

  const renderTranslateOptions = () => (
    <div className="ml-8 mt-2 space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('sourceLanguage')}
        </label>
        <select
          value={settings.sourceLanguage}
          onChange={(e) => setSettings({...settings, sourceLanguage: e.target.value})}
          className={selectClassName}
        >
          <option value="auto">{t('autoDetect')}</option>
          <option value="zh">{t('chinese')}</option>
          <option value="en">{t('english')}</option>
          <option value="ja">{t('japanese')}</option>
          <option value="ko">{t('korean')}</option>
          <option value="fr">{t('french')}</option>
          <option value="es">{t('spanish')}</option>
          <option value="de">{t('german')}</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('targetLanguage')}
        </label>
        <select
          value={settings.targetLanguage}
          onChange={(e) => setSettings({...settings, targetLanguage: e.target.value})}
          className={selectClassName}
        >
          <option value="zh">{t('chinese')}</option>
          <option value="en">{t('english')}</option>
          <option value="ja">{t('japanese')}</option>
          <option value="ko">{t('korean')}</option>
          <option value="fr">{t('french')}</option>
          <option value="es">{t('spanish')}</option>
          <option value="de">{t('german')}</option>
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
      
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="preserveEmojis"
            checked={settings.preserveEmojis}
            onChange={(e) => setSettings({...settings, preserveEmojis: e.target.checked})}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300"
          />
          <label htmlFor="preserveEmojis" className="ml-2 text-sm text-gray-700">
            {t('preserveEmojis')}
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="optimizeLength"
            checked={settings.optimizeLength}
            onChange={(e) => setSettings({...settings, optimizeLength: e.target.checked})}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300"
          />
          <label htmlFor="optimizeLength" className="ml-2 text-sm text-gray-700">
            {t('optimizeLength')}
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="reduceWordCount"
            checked={settings.reduceWordCount}
            onChange={(e) => setSettings({...settings, reduceWordCount: e.target.checked})}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300"
          />
          <label htmlFor="reduceWordCount" className="ml-2 text-sm text-gray-700">
            {t('reduceWordCount')}
          </label>
        </div>
      </div>
    </div>
  );

  const renderTTSOptions = () => (
    <div className="ml-8 mt-2 space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('voiceType')}
        </label>
        <select
          value={settings.voice}
          onChange={(e) => setSettings({...settings, voice: e.target.value})}
          className={selectClassName}
        >
          <option value="female1">{t('femaleClear')}</option>
          <option value="female2">{t('femaleSoft')}</option>
          <option value="male1">{t('maleDeep')}</option>
          <option value="male2">{t('maleNatural')}</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('speed')}
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={settings.speed}
          onChange={(e) => setSettings({...settings, speed: parseFloat(e.target.value)})}
          className="w-full"
        />
        <div className="text-sm text-gray-500 mt-1">
          {t('speedValue', { speed: settings.speed.toFixed(1) })}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('pitch')}
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={settings.pitch}
          onChange={(e) => setSettings({...settings, pitch: parseFloat(e.target.value)})}
          className="w-full"
        />
        <div className="text-sm text-gray-500 mt-1">
          {t('pitchValue', { pitch: settings.pitch.toFixed(1) })}
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl mx-auto">
      <div className="space-y-4">
        {/* 修复选项 */}
        <div className="w-full">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="repair"
              checked={options.repair}
              onChange={(e) => setOptions({...options, repair: e.target.checked})}
              className="h-4 w-4 text-indigo-600 rounded border-gray-300"
            />
            <label htmlFor="repair" className="ml-2">
              <div className="font-medium">{t('fix')}</div>
              <p className="text-sm text-gray-500">{t('fixDescription')}</p>
            </label>
          </div>
          {options.repair && renderRepairOptions()}
        </div>

        {/* 表情选项 */}
        <div className="w-full">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emoji"
              checked={options.emoji}
              onChange={(e) => setOptions({...options, emoji: e.target.checked})}
              className="h-4 w-4 text-indigo-600 rounded border-gray-300"
            />
            <label htmlFor="emoji" className="ml-2">
              <div className="font-medium">{t('emoji')}</div>
              <p className="text-sm text-gray-500">{t('emojiDescription')}</p>
            </label>
          </div>
          {options.emoji && renderEmojiOptions()}
        </div>

        {/* 翻译选项 */}
        <div className="w-full">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="translate"
              checked={options.translate}
              onChange={(e) => setOptions({...options, translate: e.target.checked})}
              className="h-4 w-4 text-indigo-600 rounded border-gray-300"
            />
            <label htmlFor="translate" className="ml-2">
              <div className="font-medium">{t('translate')}</div>
              <p className="text-sm text-gray-500">{t('translateDescription')}</p>
            </label>
          </div>
          {options.translate && renderTranslateOptions()}
        </div>

        {/* TTS选项 */}
        <div className="w-full">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="tts"
              checked={options.tts}
              onChange={(e) => {
                e.preventDefault();
                alert(t('ttsInDevelopment'));
              }}
              className="h-4 w-4 text-indigo-600 rounded border-gray-300"
            />
            <label htmlFor="tts" className="ml-2">
              <div className="font-medium">{t('tts')}</div>
              <p className="text-sm text-gray-500">{t('ttsDescription')}</p>
            </label>
          </div>
          {options.tts && renderTTSOptions()}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {(isStreaming || result) && (
        <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('original')}</h3>
              <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md text-sm">
                {subtitleContent}
              </pre>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                {isStreaming ? t('processing') : t('processed')}
              </h3>
              <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md text-sm">
                {isStreaming ? processedText : result?.processed}
              </pre>
            </div>
          </div>
          
          {!isStreaming && result && (
            <>
              <div className="flex gap-2 text-sm text-gray-500">
                {result.changes.repair && <span>{t('repairApplied')}</span>}
                {result.changes.emoji && <span>{t('emojiApplied')}</span>}
                {result.changes.translate && <span>{t('translateApplied')}</span>}
              </div>
              
              <div className="flex gap-4 mt-4">
                <Button onClick={handleDownload}>
                  {actionsT('download')}
                </Button>
                <Button variant="secondary" onClick={handleCopy}>
                  {actionsT('copy')}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !subtitleContent}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isProcessing || !subtitleContent
            ? 'bg-indigo-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('processing')}
          </div>
        ) : (
          t('process')
        )}
      </button>
    </form>
  );
};

export default SubtitleProcessForm;