import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convert messages to Anthropic format, handling both text and content array formats
    const anthropicMessages = messages.map((msg: any) => {
      // Extract text content from various message formats
      let textContent = '';

      if (typeof msg.content === 'string') {
        textContent = msg.content;
      } else if (Array.isArray(msg.content)) {
        // Handle content array format from assistant-ui
        textContent = msg.content
          .filter((part: any) => part.type === 'text')
          .map((part: any) => part.text)
          .join('');
      }

      return {
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: textContent,
      };
    });

    // Create streaming response with Skills API
    const stream = await client.beta.messages.create(
      {
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        temperature: 0.7,
        messages: anthropicMessages,
        // Use container parameter with skills array
        container: {
          skills: [
            {
              type: 'custom',
              skill_id: 'skill_017itBMGuP8s5xPH2K683nDy',
              version: 'latest',
            },
          ],
        },
        // Add code_execution tool
        tools: [
          {
            type: 'code_execution_20250825',
            name: 'code_execution',
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

    // Create a ReadableStream compatible with Vercel AI SDK v3+ format
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let messageId = `msg_${Date.now()}`;
          let fullText = '';

          for await (const event of stream) {
            // Handle different event types
            if (event.type === 'message_start') {
              messageId = event.message.id;
            } else if (event.type === 'content_block_delta') {
              if (event.delta.type === 'text_delta') {
                fullText += event.delta.text;

                // Send text delta in AI SDK v3 format
                const textDelta = `0:${JSON.stringify(event.delta.text)}\n`;
                controller.enqueue(encoder.encode(textDelta));
              }
            } else if (event.type === 'message_delta') {
              // Handle any message-level deltas
              if (event.delta.stop_reason) {
                // Message is complete
                const finishData = `d:${JSON.stringify({
                  finishReason: event.delta.stop_reason
                })}\n`;
                controller.enqueue(encoder.encode(finishData));
              }
            } else if (event.type === 'message_stop') {
              // Ensure we send finish message
              if (fullText) {
                const finishData = `d:${JSON.stringify({
                  finishReason: 'stop'
                })}\n`;
                controller.enqueue(encoder.encode(finishData));
              }
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
        'X-Vercel-AI-Data-Stream': 'v1',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
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
