import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 创建 OpenAI 客户端实例，但使用 DeepSeek API
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1', // DeepSeek API 基础 URL
});

export async function POST(request: NextRequest) {
  try {
    const { text, voice, speed } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: '没有提供文本内容' },
        { status: 400 }
      );
    }
    
    // 注意：这里假设 DeepSeek API 支持 TTS 功能
    // 如果 DeepSeek 不支持 TTS，可能需要使用其他服务
    const response = await openai.audio.speech.create({
      model: 'deepseek-tts', // 使用 DeepSeek TTS 模型（如果有的话）
      voice: voice || 'alloy',
      input: text,
      speed: parseFloat(speed) || 1.0,
    });
    
    // 获取音频数据
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // 返回音频数据
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('TTS API错误:', error);
    return NextResponse.json(
      { error: '处理TTS请求时发生错误' },
      { status: 500 }
    );
  }
} 