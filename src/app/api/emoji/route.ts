import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 创建 OpenAI 客户端实例，但使用 DeepSeek API
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1', // DeepSeek API 基础 URL
});

export async function POST(request: NextRequest) {
  try {
    const { text, density, position, style } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: '没有提供文本内容' },
        { status: 400 }
      );
    }
    
    let densityGuidance = '';
    if (density === 'low') {
      densityGuidance = '使用较少的表情符号，每个字幕最多添加1个';
    } else if (density === 'medium') {
      densityGuidance = '适量使用表情符号，每个字幕添加1-2个';
    } else if (density === 'high') {
      densityGuidance = '丰富使用表情符号，每个字幕添加2-3个';
    }
    
    let positionGuidance = '';
    if (position === 'start') {
      positionGuidance = '将表情符号添加在文本开头';
    } else if (position === 'end') {
      positionGuidance = '将表情符号添加在文本结尾';
    } else if (position === 'inline') {
      positionGuidance = '将表情符号穿插在文本中合适的位置';
    }
    
    let styleGuidance = '';
    if (style === 'modern') {
      styleGuidance = '使用现代流行的表情符号';
    } else if (style === 'classic') {
      styleGuidance = '使用经典的表情符号';
    }
    
    const systemPrompt = `你是一个专业的表情符号添加助手。
    请根据文本内容添加合适的表情符号，使内容更加生动有趣。
    ${densityGuidance}
    ${positionGuidance}
    ${styleGuidance}
    内容是字幕文本，每个字幕条目用"||||"分隔。
    请确保添加的表情符号与文本内容相关，能够表达或增强文本的情感和意义。`;
    
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat', // 使用 DeepSeek 模型
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.7,
    });
    
    const processedText = response.choices[0].message.content || '';
    
    return NextResponse.json({ processedText });
  } catch (error) {
    console.error('表情符号API错误:', error);
    return NextResponse.json(
      { error: '处理表情符号请求时发生错误' },
      { status: 500 }
    );
  }
} 