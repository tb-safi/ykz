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

    // Check if the content block is a text block
    const contentBlock = message.content[0];
    if (contentBlock.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }
    
    return NextResponse.json({ sentence: contentBlock.text.trim() });
  } catch (error) {
    console.error("Error generating sentence:", error);
    return NextResponse.json(
      { error: 'Failed to generate sentence' },
      { status: 500 }
    );
  }
} 