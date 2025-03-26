type SubtitleEntry = {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
};

export type ParsedSubtitle = {
  format: 'srt' | 'vtt' | 'ass' | 'unknown';
  entries: SubtitleEntry[];
};

/**
 * 解析SRT格式字幕
 */
export function parseSRT(content: string): SubtitleEntry[] {
  const entries: SubtitleEntry[] = [];
  const blocks = content.trim().split(/\r?\n\r?\n/);
  
  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    if (lines.length < 3) continue;
    
    const id = parseInt(lines[0].trim(), 10);
    const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
    
    if (!timeMatch) continue;
    
    const startTime = timeMatch[1];
    const endTime = timeMatch[2];
    const text = lines.slice(2).join('\n');
    
    entries.push({ id, startTime, endTime, text });
  }
  
  return entries;
}

/**
 * 解析VTT格式字幕
 */
export function parseVTT(content: string): SubtitleEntry[] {
  // VTT解析逻辑
  // ...
  return [];
}

/**
 * 解析ASS格式字幕
 */
export function parseASS(content: string): SubtitleEntry[] {
  // ASS解析逻辑
  // ...
  return [];
}

/**
 * 检测字幕类型并解析内容
 */
export function parseSubtitle(content: string): ParsedSubtitle {
  // 移除BOM标记
  content = content.replace(/^\uFEFF/, '');
  
  if (content.includes('WEBVTT')) {
    return {
      format: 'vtt',
      entries: parseVTT(content),
    };
  } else if (content.includes('[Script Info]')) {
    return {
      format: 'ass',
      entries: parseASS(content),
    };
  } else {
    // 默认尝试解析SRT
    return {
      format: 'srt',
      entries: parseSRT(content),
    };
  }
}

/**
 * 将解析后的字幕导出为SRT格式
 */
export function exportToSRT(subtitle: SubtitleEntry[]): string {
  return subtitle
    .map((entry, index) => {
      return `${index + 1}\n${entry.startTime} --> ${entry.endTime}\n${entry.text}\n`;
    })
    .join('\n');
}

/**
 * 将解析后的字幕导出为VTT格式
 */
export function exportToVTT(subtitle: SubtitleEntry[]): string {
  return `WEBVTT\n\n${subtitle
    .map((entry, index) => {
      return `${index + 1}\n${entry.startTime.replace(',', '.')} --> ${entry.endTime.replace(',', '.')}\n${entry.text}\n`;
    })
    .join('\n')}`;
} 