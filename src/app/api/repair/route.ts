import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 创建 OpenAI 客户端实例，但使用 DeepSeek API
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1', // DeepSeek API 基础 URL
});

export async function POST(request: NextRequest) {
  try {
    const { 
      text, 
      correctGrammar, 
      fixPunctuation, 
      improvePhrasing, 
      ensureConsistency 
    } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: '没有提供文本内容' },
        { status: 400 }
      );
    }
    
    let tasks = [];
    if (correctGrammar) tasks.push('纠正语法和拼写错误');
    if (fixPunctuation) tasks.push('修复标点符号问题');
    if (improvePhrasing) tasks.push('改善表达方式，使语句更通顺自然');
    if (ensureConsistency) tasks.push('确保术语和表达方式的一致性');
    
    if (tasks.length === 0) {
      tasks.push('纠正明显的错误，改善字幕质量');
    }
    
    const taskDescription = tasks.join('、');
    
    const systemPrompt = `你是一个专业的字幕修复专家。请对以下字幕文本进行修复，主要任务：${taskDescription}。
    内容是字幕文本，每个字幕条目用"||||"分隔。
    请保持修复后的字幕简洁、清晰，不要过度修改原意。
    
    对于每个字幕条目，如果你进行了修改，请在修复后的文本后面添加"[MODIFIED]"标记，如果没有修改则不添加标记。
    请确保保留原始字幕中的所有换行符。
    
    例如：
    原文: "这是一个有错误的字幕,标点符号不正确还有错别字"
    修复后: "这是一个有错误的字幕，标点符号不正确还有错别字。[MODIFIED]"
    
    请仅返回修复后的文本，保持原有的分隔符。`;
    
    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 使用 DeepSeek V3 模型，启用流式输出
          const stream = await openai.chat.completions.create({
            model: 'deepseek-chat', // 使用 DeepSeek V3 模型
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: text }
            ],
            temperature: 0.3,
            stream: true, // 启用流式输出
          });
          
          // 处理流式响应
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                // 将内容编码为 UTF-8 并发送
                // 添加错误处理，防止在控制器关闭后继续发送数据
                try {
                  controller.enqueue(new TextEncoder().encode(content));
                } catch (error) {
                  console.log('流已关闭，无法继续发送数据');
                  break;
                }
              }
            }
            
            // 只有在没有错误的情况下才关闭控制器
            controller?.close();
          } catch (error) {
            // 捕获流处理过程中的错误
            console.error('流处理过程中发生错误:', error);
            // 尝试关闭控制器，但忽略可能的"已关闭"错误
            try {
              controller.close();
            } catch (closeError) {
              console.log('关闭控制器时出错，可能已经关闭');
            }
          }
        } catch (error) {
          console.error('流式处理错误:', error);
          // 尝试发送错误信息，但忽略可能的"已关闭"错误
          try {
            controller.error(error);
          } catch (errorError) {
            console.log('发送错误时出错，控制器可能已关闭');
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
    console.error('字幕修复API错误:', error);
    return NextResponse.json(
      { error: '处理字幕修复请求时发生错误' },
      { status: 500 }
    );
  }
} 