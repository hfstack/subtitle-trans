import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 创建 OpenAI 客户端实例
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1',
});

export async function POST(request: NextRequest) {
  // 创建一个 AbortController 用于取消 OpenAI 请求
  const abortController = new AbortController();
  
  // 监听请求取消事件
  request.signal.addEventListener('abort', () => {
    console.log('客户端取消了请求，正在中止 OpenAI 调用');
    abortController.abort();
  });
  
  try {
    const { text, density, position, style } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: '没有提供文本内容' },
        { status: 400 }
      );
    }
    
    // 根据密度设置表情符号的频率
    let frequencyDesc = '';
    if (density === 'low') {
      frequencyDesc = '偶尔添加，每5-10个句子添加一个表情';
    } else if (density === 'medium') {
      frequencyDesc = '适量添加，每2-4个句子添加一个表情';
    } else if (density === 'high') {
      frequencyDesc = '频繁添加，几乎每个句子都添加表情';
    }
    
    // 根据位置设置表情符号的位置
    let positionDesc = '';
    if (position === 'start') {
      positionDesc = '在句子开头';
    } else if (position === 'end') {
      positionDesc = '在句子结尾';
    } else if (position === 'inline') {
      positionDesc = '在句子中间，根据语义合适的位置';
    }
    
    // 根据风格设置表情符号的类型
    let styleDesc = '';
    if (style === 'modern') {
      styleDesc = '使用现代流行的表情符号';
    } else if (style === 'classic') {
      styleDesc = '使用经典传统的表情符号';
    }
    
    const systemPrompt = `你是一个专业的字幕表情添加专家。请为以下字幕文本添加适当的表情符号，使其更加生动有表现力。
    内容是字幕文本，每个字幕条目用"||||"分隔。
    
    添加表情符号的要求：
    - 频率：${frequencyDesc}
    - 位置：${positionDesc}
    - 风格：${styleDesc}
    
    请根据文本内容和情感选择合适的表情符号，不要改变原文的意思。
    请保持原有的分隔符，只返回添加了表情符号的文本。`;
    
    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 使用 DeepSeek 模型，启用流式输出
          const stream = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: text }
            ],
            temperature: 0.7,
            stream: true,
            signal: abortController.signal // 使用 AbortController 的信号
          });
          
          // 处理流式响应
          try {
            for await (const chunk of stream) {
              // 检查请求是否已被取消
              if (request.signal.aborted) {
                console.log('请求已被取消，停止处理流');
                break;
              }
              
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                // 将内容编码为 UTF-8 并发送
                try {
                  controller.enqueue(new TextEncoder().encode(content));
                } catch (error) {
                  console.log('流已关闭，无法继续发送数据');
                  break;
                }
              }
            }
            
            // 只有在没有错误且请求未被取消的情况下才关闭控制器
            if (!request.signal.aborted && controller) {
              controller.close();
            }
          } catch (error) {
            // 捕获流处理过程中的错误
            console.error('流处理过程中发生错误:', error);
            // 尝试关闭控制器，但忽略可能的"已关闭"错误
            if (controller) {
              try {
                controller.close();
              } catch (closeError) {
                console.log('关闭控制器时出错，可能已经关闭');
              }
            }
          }
        } catch (error) {
          // 忽略因取消导致的错误
          if (error.name === 'AbortError') {
            console.log('OpenAI 请求被中止');
            if (controller) {
              try {
                controller.close();
              } catch (closeError) {
                console.log('关闭控制器时出错，可能已经关闭');
              }
            }
            return;
          }
          
          console.error('流式处理错误:', error);
          // 尝试发送错误信息，但忽略可能的"已关闭"错误
          if (controller) {
            try {
              controller.error(error);
            } catch (errorError) {
              console.log('发送错误时出错，控制器可能已关闭');
            }
          }
        }
      }
    });
    
    // 返回流式响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('表情添加API错误:', error);
    return NextResponse.json(
      { error: '处理表情添加请求时发生错误' },
      { status: 500 }
    );
  }
} 