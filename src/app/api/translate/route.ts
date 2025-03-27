import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 创建 OpenAI 客户端实例，但使用 DeepSeek API
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1', // DeepSeek API 基础 URL
});

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang, targetLang, preserveFormatting } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: '没有提供文本内容' },
        { status: 400 }
      );
    }
    
    const systemPrompt = `你是一个专业的翻译专家。请将以下文本从${sourceLang}翻译成${targetLang}。
    ${preserveFormatting ? '请保留原文的格式，包括换行和特殊标记。' : ''}
    内容是字幕文本，每个字幕条目用"||||"分隔。请保持字幕的自然流畅，避免直译造成的不通顺。`;
    
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat', // 使用 DeepSeek 模型
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
    });
    
    const translatedText = response.choices[0].message.content || '';
    
    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('翻译API错误:', error);
    return NextResponse.json(
      { error: '处理翻译请求时发生错误' },
      { status: 500 }
    );
  }
} 