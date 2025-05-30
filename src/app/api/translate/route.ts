import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 创建 OpenAI 客户端实例，但使用 DeepSeek API
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1', // DeepSeek API 基础 URL
});

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang, targetLang, preserveFormatting, optimizeLength, reduceWordCount } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: '没有提供文本内容' },
        { status: 400 }
      );
    }
    
    const systemPrompt = `你是一个专业的字幕翻译专家。请将以下文本从${sourceLang}翻译成${targetLang}。
    ${preserveFormatting ? '请保留原文的格式，包括换行和特殊标记。' : ''}
    ${optimizeLength ? '请尽量使翻译后的文本长度与原文相近，使朗读时长接近，但不要为此牺牲翻译质量。' : ''}
    ${reduceWordCount ? '在表达同样语意的情况下，尽可能减少目标语言的单词数量，使字幕更加简洁。' : ''}
    
    重要提示：
    1. 这是字幕翻译，每个字幕条目都有固定的时间区间。请严格保持原文的语序，不要为了符合目标语言的表达习惯而改变语序，否则会导致字幕与视频不同步。
    2. 请保留原文中的所有表情符号(emoji)，不要删除或替换它们。
    3. 对于较长的字幕内容，请在适当位置添加换行符，通常在句子中间或语义单元之间。
    4. 每行字幕不应超过40个字符，以确保在屏幕上显示良好。
    
    内容是字幕文本，每个字幕条目用"||||"分隔。请保持字幕的自然流畅，避免直译造成的不通顺，但同时要尊重原文的语序和时间结构。
    
    请确保返回的翻译结果包含所有原始字幕条目，并且每个条目都有对应的翻译。`;
    
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat', // 使用 DeepSeek 模型
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      stream: true,
    });
    
    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        
        controller.close();
      },
    });
    
    return new Response(stream);
  } catch (error) {
    console.error('翻译API错误:', error);
    return NextResponse.json(
      { error: '处理翻译请求时发生错误' },
      { status: 500 }
    );
  }
} 