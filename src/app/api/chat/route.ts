import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Inicializa o cliente DeepSeek (compatível com OpenAI) dentro da função
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Mensagem não fornecida' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat', // ou 'deepseek-reasoner' para mais raciocínio
      messages: [{ role: 'user', content: message }],
      stream: false, // se quiser streaming, mude para true e ajuste a resposta
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Erro DeepSeek:', error);
    return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
  }
}