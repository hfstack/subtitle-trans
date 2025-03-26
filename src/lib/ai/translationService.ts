import { SubtitleEntry } from '@/lib/subtitle/parser';

type TranslationOptions = {
  sourceLang: string;
  targetLang: string;
  preserveFormatting: boolean;
};

/**
 * 使用AI翻译字幕内容
 */
export async function translateSubtitles(
  entries: SubtitleEntry[],
  options: TranslationOptions
): Promise<SubtitleEntry[]> {
  try {
    // 构建请求体
    const textToTranslate = entries.map(entry => entry.text).join('\n||||\n');
    
    // 发送到API
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textToTranslate,
        sourceLang: options.sourceLang,
        targetLang: options.targetLang,
        preserveFormatting: options.preserveFormatting,
      }),
    });
    
    if (!response.ok) {
      throw new Error('翻译请求失败');
    }
    
    const data = await response.json();
    const translatedTexts = data.translatedText.split('\n||||\n');
    
    // 将翻译后的文本合并回字幕条目
    return entries.map((entry, index) => ({
      ...entry,
      text: translatedTexts[index] || entry.text,
    }));
  } catch (error) {
    console.error('翻译过程中发生错误:', error);
    throw error;
  }
} 