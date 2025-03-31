import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1',
});

export async function POST(request: Request) {
  try {
    const { text, options, settings } = await request.json();
    
    if (!text || !options) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 构建处理提示词
    const tasks = [];
    const instructions = [];
    
    if (options.repair) {
      tasks.push('修复字幕中的错误');
      instructions.push(`
        - 修复级别：${settings.repairLevel}
        - ${settings.fixPunctuation ? '修正标点符号' : ''}
        - ${settings.fixGrammar ? '修正语法错误' : ''}
        - ${settings.fixSpelling ? '修正拼写错误' : ''}
      `);
    }
    
    if (options.emoji) {
      tasks.push('添加表情符号');
      instructions.push(`
        - 表情密度：${settings.emojiDensity}
        - 表情位置：${settings.emojiPosition}
        - 表情风格：${settings.emojiStyle}
      `);
    }
    
    if (options.translate) {
      tasks.push('翻译字幕');
      instructions.push(`
        - 源语言：${settings.sourceLanguage}
        - 目标语言：${settings.targetLanguage}
        - ${settings.preserveEmojis ? '保留表情符号' : ''}
        - ${settings.optimizeLength ? '优化翻译长度' : ''}
      `);
    }

    const systemPrompt = `你是一个专业的字幕处理专家。请对以下字幕文本进行处理：
    
    需要执行的任务：${tasks.join('、')}
    
    处理要求：
    ${instructions.join('\n')}
    
    请按照以下格式返回结果：
    1. 保持原文的换行格式
    2. 如果进行了翻译，请确保语序与原文一致
    3. 如果添加了表情，要根据上下文语境选择合适的表情
    4. 所有的修改都应该保持字幕的可读性和简洁性
    
    请只返回处理后的文本，不要添加任何解释或说明。`;

    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
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
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('字幕处理API错误:', error);
    return NextResponse.json(
      { error: '处理字幕时发生错误' },
      { status: 500 }
    );
  }
} 