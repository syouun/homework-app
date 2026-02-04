import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const RequestSchema = z.object({
  taskId: z.string(),
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = RequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid Request', details: parseResult.error }, { status: 400 });
    }

    const { taskId, message, history } = parseResult.data;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { user: true },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const { user, title, description, subject } = task;
    const grade = user.grade || 'ELEMENTARY_1'; // Default
    const subjectContext = subject || 'General';

    // Construct System Prompt
    let toneInstruction = '';
    if (grade.startsWith('ELEMENTARY_1') || grade.startsWith('ELEMENTARY_2') || grade.startsWith('ELEMENTARY_3')) {
      toneInstruction = 'Tone: Very simple, uses Hiragana, friendly, simple vocabulary. Like a kindergarten teacher. Use many emojis.';
    } else if (grade.startsWith('ELEMENTARY')) {
      toneInstruction = 'Tone: Polite, friendly, clear. Can use simple Kanji.';
    } else {
      toneInstruction = 'Tone: Logical, concise, supportive. Use "Desu/Masu" style.';
    }

    const systemPrompt = `
You are a friendly and helpful tutor for a child.
The child's grade is: ${grade}.
The subject is: ${subjectContext}.
The current task is: "${title}" - ${description || 'No description'}.

Your Goal: Help the child understand the task or solve the problem WITHOUT giving the direct answer.
Constraint: NEVER provide the final answer immediately. Guide them step-by-step.
${toneInstruction}

Interaction:
- Praise them for asking.
- Ask leading questions.
- If they are stuck on calculation, suggest breaking it down.
`;

    // Initialize Model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    });

    // Convert OpenAI history format (user/assistant) to Gemini format (user/model)
    // Limit to last 10 messages for context window management
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user', // Map 'assistant' to 'model', 'system' is ignored as it's passed via systemInstruction
      parts: [{ text: msg.content }]
    })).filter(msg => msg.role === 'user' || msg.role === 'model'); // Filter out any stray system messages if they were in history

    const chat = model.startChat({
      history: recentHistory,
    });

    const result = await chat.sendMessageStream(message);

    // Convert to readable stream for Next.js
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const content = chunk.text();
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error: unknown) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: (error as Error).message,
      name: (error as Error).name
    }, { status: 500 });
  }
}
