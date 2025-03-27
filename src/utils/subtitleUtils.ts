// 字幕条目类型
export interface SubtitleEntry {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

/**
 * 解析SRT格式字幕
 */
export function parseSRT(content: string): SubtitleEntry[] {
  const entries: SubtitleEntry[] = [];
  const blocks = content.trim().split(/\r?\n\r?\n/);
  
  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    if (lines.length < 3) continue;
    
    const id = parseInt(lines[0].trim());
    const timeLine = lines[1].trim();
    const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
    
    if (!timeMatch) continue;
    
    const startTime = timeMatch[1];
    const endTime = timeMatch[2];
    const text = lines.slice(2).join('\n');
    
    entries.push({ id, startTime, endTime, text });
  }
  
  return entries;
}

/**
 * 将字幕条目转换为SRT格式
 */
export function formatToSRT(entries: SubtitleEntry[]): string {
  return entries.map(entry => {
    return `${entry.id}\n${entry.startTime} --> ${entry.endTime}\n${entry.text}`;
  }).join('\n\n');
}

/**
 * 将字幕条目转换为用||||分隔的纯文本
 * 用于发送到API
 */
export function entriesToText(entries: SubtitleEntry[]): string {
  return entries.map(entry => entry.text).join('||||');
}

/**
 * 将API返回的文本重新应用到原始字幕条目
 */
export function applyTextToEntries(entries: SubtitleEntry[], text: string): SubtitleEntry[] {
  const textParts = text.split('||||');
  
  // 确保文本部分数量与条目数量匹配
  if (textParts.length !== entries.length) {
    console.warn(`文本部分数量(${textParts.length})与条目数量(${entries.length})不匹配`);
    // 尝试尽可能匹配
    const minLength = Math.min(textParts.length, entries.length);
    return entries.slice(0, minLength).map((entry, i) => ({
      ...entry,
      text: textParts[i].trim()
    }));
  }
  
  return entries.map((entry, i) => ({
    ...entry,
    text: textParts[i].trim()
  }));
}

/**
 * 解析带有[MODIFIED]标记的修复后字幕
 * 返回修复后的文本和修改状态
 */
export function parseModifiedSubtitles(text: string): { text: string; isModified: boolean }[] {
  const entries = text.split('||||');
  
  return entries.map(entry => {
    const isModified = entry.includes('[MODIFIED]');
    const cleanText = entry.replace('[MODIFIED]', '').trim();
    
    return {
      text: cleanText,
      isModified
    };
  });
}

/**
 * 比较原始字幕和修复后的字幕
 */
export function compareSubtitles(original: string, repaired: string): {
  originalEntries: string[];
  repairedEntries: { text: string; isModified: boolean }[];
} {
  const originalEntries = original.split('||||').map(entry => entry.trim());
  const repairedResult = parseModifiedSubtitles(repaired);
  
  return {
    originalEntries,
    repairedEntries: repairedResult
  };
}

/**
 * 格式化字幕文本用于显示
 * 保留换行符，但转换为HTML可显示的格式
 */
export function formatSubtitleForDisplay(text: string): string {
  // 将换行符替换为<br>标签，以便在HTML中正确显示
  return text.replace(/\n/g, '<br>');
}

/**
 * 计算两个文本之间的差异并高亮显示
 */
export function highlightDifferences(original: string, modified: string): string {
  if (!original || !modified) return modified;
  
  // 简单的差异检测和高亮
  // 这里使用一个简化的方法，实际项目中可能需要更复杂的差异算法
  const words1 = original.split(/(\s+)/);
  const words2 = modified.split(/(\s+)/);
  
  let result = '';
  let i = 0, j = 0;
  
  while (i < words1.length && j < words2.length) {
    if (words1[i] === words2[j]) {
      result += words2[j];
      i++;
      j++;
    } else {
      // 找到不同的部分，高亮显示
      result += `<span class="bg-yellow-200 text-yellow-800">${words2[j]}</span>`;
      j++;
      
      // 尝试跳过原文中的一个词，看是否能同步
      if (i + 1 < words1.length && words1[i + 1] === words2[j]) {
        i++;
      }
    }
  }
  
  // 添加剩余的修改后文本
  while (j < words2.length) {
    result += `<span class="bg-yellow-200 text-yellow-800">${words2[j]}</span>`;
    j++;
  }
  
  return result;
} 