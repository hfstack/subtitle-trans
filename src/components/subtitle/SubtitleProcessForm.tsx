"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

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
}

const SubtitleProcessForm = () => {
  const t = useTranslations('features');
  const [options, setOptions] = useState<ProcessOptions>({
    repair: true,
    emoji: true,
    translate: true,
    tts: true
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
    pitch: 1.0
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // TODO: 实现处理逻辑
      console.log('处理选项:', options);
      console.log('处理设置:', settings);
    } finally {
      setIsProcessing(false);
    }
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
          <option value="de">{t('german')}</option>
          <option value="es">{t('spanish')}</option>
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
          <option value="de">{t('german')}</option>
          <option value="es">{t('spanish')}</option>
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
              onChange={(e) => setOptions({...options, tts: e.target.checked})}
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

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isProcessing ? t('processing') : t('process')}
      </button>
    </form>
  );
};

export default SubtitleProcessForm;