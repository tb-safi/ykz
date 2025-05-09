import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { word } = await request.json();

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `Generate a simple example sentence in Finnish using the word "${word.finnish}" (${word.english}). The sentence should be short and easy to understand.`
        }
      ]
    });

    // The response content is now in message.content[0].text
    const sentence = message.content[0].text;
    
    return NextResponse.json({ sentence: sentence.trim() });
  } catch (error) {
    console.error("Error generating sentence:", error);
    return NextResponse.json(
      { error: 'Failed to generate sentence' },
      { status: 500 }
    );
  }
} 