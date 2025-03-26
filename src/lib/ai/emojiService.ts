import { SubtitleEntry } from '@/lib/subtitle/parser';

type EmojiOptions = {
  density: 'low' | 'medium' | 'high';
  position: 'start' | 'end' | 'inline';
  style: 'modern' | 'classic';
};

/**
 * 使用AI为字幕添加表情符号
 */
export async function addEmojisToSubtitles(
  entries: SubtitleEntry[],
  options: EmojiOptions
): Promise<SubtitleEntry[]> {
  try {
    // 构建请求体
    const textToProcess = entries.map(entry => entry.text).join('\n||||\n');
    
    // 发送到API
    const response = await fetch('/api/emoji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textToProcess,
        density: options.density,
        position: options.position,
        style: options.style,
      }),
    });
    
    if (!response.ok) {
      throw new Error('添加表情符号请求失败');
    }
    
    const data = await response.json();
    const processedTexts = data.processedText.split('\n||||\n');
    
    // 将处理后的文本合并回字幕条目
    return entries.map((entry, index) => ({
      ...entry,
      text: processedTexts[index] || entry.text,
    }));
  } catch (error) {
    console.error('添加表情符号过程中发生错误:', error);
    throw error;
  }
} 