import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

// Initialize Anthropic client
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Claude Skills system prompts
const CLAUDE_SKILLS = `
# Commercial Printing Assistant

You are an AI assistant for a commercial printing company. You have expertise in the following areas:

## SKILL 1: Print Production & Specifications
- Understanding print specifications (DPI, color modes, bleed, trim)
- File format requirements (PDF/X, TIFF, EPS)
- Color management (CMYK, Pantone, color profiles)
- Paper types, weights, and finishes
- Binding and finishing options

## SKILL 2: Customer Service & Order Management
- Quoting and pricing assistance
- Order status and tracking
- Turnaround time estimates
- Addressing common customer concerns
- Rush order handling

## SKILL 3: Design & Prepress Support
- File preparation best practices
- Common design issues and solutions
- Template recommendations
- Proofing processes
- Color correction guidance

## SKILL 4: Product Knowledge
- Business cards and stationery
- Brochures and flyers
- Banners and signage
- Packaging solutions
- Promotional materials

## SKILL 5: Technical Troubleshooting
- File upload and compatibility issues
- Print quality concerns
- Color matching problems
- Material selection advice

When responding:
- Be professional, friendly, and helpful
- Provide specific, actionable advice
- Ask clarifying questions when needed
- Reference industry standards when applicable
- Suggest alternatives when appropriate
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Add system prompt with Claude Skills
    const messagesWithSystem = [
      {
        role: 'system' as const,
        content: CLAUDE_SKILLS,
      },
      ...messages,
    ];

    const result = streamText({
      model: anthropic('claude-sonnet-4-5-20250514'),
      messages: messagesWithSystem,
      temperature: 0.7,
      maxTokens: 4096,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
