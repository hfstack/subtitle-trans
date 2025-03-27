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