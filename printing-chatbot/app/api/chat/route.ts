import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// IMPORTANT: Run 'npm run upload-skills' first to get these IDs
// Replace these placeholder IDs with the actual skill IDs from the upload script
const SKILL_IDS = [
  'skill-id-1', // Print Production & Specifications
  'skill-id-2', // Customer Service & Order Management
  'skill-id-3', // Design & Prepress Support
  'skill-id-4', // Product Knowledge
  'skill-id-5', // Technical Troubleshooting
];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Create streaming response with Skills API
    const stream = await client.beta.messages.create(
      {
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        temperature: 0.7,
        messages: anthropicMessages,
        // Use container parameter with skills array
        container: {
          skills: SKILL_IDS,
        },
        // Add code_execution tool
        tools: [
          {
            type: 'code_execution',
          },
        ],
        stream: true,
      },
      {
        headers: {
          // Add beta headers for code execution and skills
          'anthropic-beta': 'code-execution-2025-08-25,skills-2025-10-02',
        },
      }
    );

    // Create a ReadableStream compatible with Vercel AI SDK format
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let messageId = `msg_${Date.now()}`;

          for await (const event of stream) {
            // Handle different event types
            if (event.type === 'message_start') {
              messageId = event.message.id;
            } else if (event.type === 'content_block_delta') {
              if (event.delta.type === 'text_delta') {
                // Send text chunks in AI SDK format
                const chunk = {
                  id: messageId,
                  role: 'assistant',
                  content: event.delta.text,
                };
                controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
              }
            } else if (event.type === 'message_stop') {
              // Send completion message
              controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
              controller.close();
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1',
      },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
