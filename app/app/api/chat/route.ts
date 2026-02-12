import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  console.log('=== Chat API called ===');
  
  try {
    const { messages, subject, currentLesson } = await request.json();
    console.log('Received messages count:', messages.length);
    console.log('Subject:', subject);
    console.log('Current lesson:', currentLesson?.title);

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length);

    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API key not configured. Please add GEMINI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    // Initialize Gemini client
    console.log('Initializing Gemini client...');
    const genAI = new GoogleGenerativeAI(apiKey);

    // System prompt for the AI tutor
    const systemPrompt = `You are an expert tutor specializing in ${subject}. 
You are currently teaching: ${currentLesson?.title || 'general concepts'}.

Your role is to:
1. Explain concepts clearly and engagingly
2. Answer questions with detailed explanations
3. Provide examples when helpful
4. Encourage the student
5. When a student completes understanding a topic, acknowledge their progress

Keep responses concise but informative. Use analogies when helpful.`;

    // Get the Gemini model
    console.log('Getting Gemini model...');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    });
    
    // Build conversation history with system prompt
    const lastUserMessage = messages[messages.length - 1];
    const conversationContext = messages.slice(0, -1)
      .map((msg: any) => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`)
      .join('\n\n');
    
    // Full prompt with context
    const fullPrompt = `${systemPrompt}

Previous conversation:
${conversationContext}

Student: ${lastUserMessage.content}

Tutor:`;
    
    console.log('Calling Gemini API with prompt length:', fullPrompt.length);
    
    const result = await model.generateContent(fullPrompt);
    console.log('Gemini API call successful');
    
    const response = await result.response;
    const text = response.text();

    console.log('✅ Gemini response received, length:', text.length);
    console.log('Response preview:', text.substring(0, 100) + '...');

    return NextResponse.json({
      message: text,
    });
  } catch (error: any) {
    console.error('❌ Gemini API error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for specific error types
    if (error.message?.includes('API_KEY_INVALID')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your GEMINI_API_KEY in .env.local' },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('SAFETY')) {
      return NextResponse.json(
        { error: 'Content blocked by safety filters. Please rephrase your question.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: `AI Error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
