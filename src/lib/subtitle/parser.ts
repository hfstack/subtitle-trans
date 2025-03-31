export type SubtitleEntry = {
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
  const entries: SubtitleEntry[] = [];
  // 移除WEBVTT头部信息
  const lines = content.replace(/^WEBVTT.*?(\r?\n)+/i, '').split(/\r?\n/);
  
  let id = 1;
  let startTime = '';
  let endTime = '';
  let text = '';
  let inCue = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 空行表示一个字幕块的结束
    if (line === '') {
      if (inCue && startTime && endTime) {
        entries.push({ id, startTime, endTime, text: text.trim() });
        text = '';
        inCue = false;
      }
      continue;
    }
    
    // 检查是否是时间行
    const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/);
    if (timeMatch) {
      startTime = timeMatch[1].replace('.', ',');
      endTime = timeMatch[2].replace('.', ',');
      inCue = true;
      id++;
      continue;
    }
    
    // 如果不是数字标识（某些VTT有数字标识，类似SRT），且我们在一个字幕块内，则为文本
    if (inCue && !/^\d+$/.test(line)) {
      text += (text ? '\n' : '') + line;
    }
  }
  
  // 处理最后一个字幕块
  if (inCue && startTime && endTime && text) {
    entries.push({ id, startTime, endTime, text: text.trim() });
  }
  
  return entries;
}

/**
 * 解析ASS格式字幕
 */
export function parseASS(content: string): SubtitleEntry[] {
  const entries: SubtitleEntry[] = [];
  const lines = content.split(/\r?\n/);
  
  let inEvents = false;
  let formatLine = '';
  let textIndex = -1;
  let startIndex = -1;
  let endIndex = -1;
  let id = 1;
  
  for (const line of lines) {
    // 检查是否进入[Events]部分
    if (line.trim() === '[Events]') {
      inEvents = true;
      continue;
    }
    
    // 如果在[Events]部分，查找Format行
    if (inEvents && line.startsWith('Format:')) {
      formatLine = line.substring('Format:'.length).trim();
      const formats = formatLine.split(',').map(f => f.trim());
      
      // 找到Text, Start, End在格式定义中的位置
      textIndex = formats.findIndex(f => f.toLowerCase() === 'text');
      startIndex = formats.findIndex(f => f.toLowerCase() === 'start');
      endIndex = formats.findIndex(f => f.toLowerCase() === 'end');
      continue;
    }
    
    // 解析Dialogue行
    if (inEvents && line.startsWith('Dialogue:') && textIndex !== -1 && startIndex !== -1 && endIndex !== -1) {
      const parts = splitASSLine(line.substring('Dialogue:'.length).trim());
      
      if (parts.length > Math.max(textIndex, startIndex, endIndex)) {
        const startTime = convertASSTime(parts[startIndex]);
        const endTime = convertASSTime(parts[endIndex]);
        let text = parts[textIndex];
        
        // 移除ASS样式代码
        text = text.replace(/{[^}]*}/g, '');
        // 替换换行符
        text = text.replace(/\\N/g, '\n');
        
        entries.push({ id: id++, startTime, endTime, text });
      }
    }
  }
  
  return entries;
}

/**
 * 辅助函数：分割ASS行，考虑到逗号可能出现在文本中
 */
function splitASSLine(line: string): string[] {
  const parts: string[] = [];
  let currentPart = '';
  let inBraces = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '{') {
      inBraces = true;
      currentPart += char;
    } else if (char === '}') {
      inBraces = false;
      currentPart += char;
    } else if (char === ',' && !inBraces) {
      parts.push(currentPart);
      currentPart = '';
    } else {
      currentPart += char;
    }
  }
  
  if (currentPart) {
    parts.push(currentPart);
  }
  
  return parts;
}

/**
 * 辅助函数：将ASS时间格式转换为SRT时间格式
 */
function convertASSTime(assTime: string): string {
  // ASS格式: h:mm:ss.cc (例如 0:00:01.00)
  // SRT格式: hh:mm:ss,mmm (例如 00:00:01,000)
  const match = assTime.trim().match(/(\d+):(\d{2}):(\d{2})\.(\d{2})/);
  
  if (match) {
    const [hours, minutes, seconds, centiseconds] = match;
    const paddedHours = hours.padStart(2, '0');
    const milliseconds = (parseInt(centiseconds) * 10).toString().padStart(3, '0');
    
    return `${paddedHours}:${minutes}:${seconds},${milliseconds}`;
  }
  
  return assTime; // 如果格式不匹配，返回原始值
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
