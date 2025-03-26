import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    请仅返回修复后的文本，保持原有的分隔符。`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
    });
    
    const repairedText = response.choices[0].message.content || '';
    
    return NextResponse.json({ repairedText });
  } catch (error) {
    console.error('字幕修复API错误:', error);
    return NextResponse.json(
      { error: '处理字幕修复请求时发生错误' },
      { status: 500 }
    );
  }
} 