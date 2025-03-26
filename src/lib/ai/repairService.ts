import { SubtitleEntry } from '@/lib/subtitle/parser';

type RepairOptions = {
  correctGrammar: boolean;
  fixPunctuation: boolean;
  improvePhrasing: boolean;
  ensureConsistency: boolean;
};

/**
 * 使用AI修复字幕内容
 */
export async function repairSubtitles(
  entries: SubtitleEntry[],
  options: RepairOptions
): Promise<SubtitleEntry[]> {
  try {
    // 构建请求体
    const textToRepair = entries.map(entry => entry.text).join('\n||||\n');
    
    // 发送到API
    const response = await fetch('/api/repair', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textToRepair,
        ...options,
      }),
    });
    
    if (!response.ok) {
      throw new Error('字幕修复请求失败');
    }
    
    const data = await response.json();
    const repairedTexts = data.repairedText.split('\n||||\n');
    
    // 将修复后的文本合并回字幕条目
    return entries.map((entry, index) => ({
      ...entry,
      text: repairedTexts[index] || entry.text,
    }));
  } catch (error) {
    console.error('字幕修复过程中发生错误:', error);
    throw error;
  }
} 