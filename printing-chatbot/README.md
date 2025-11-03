# Commercial Printing Assistant Chatbot

An AI-powered chatbot for commercial printing companies, built with **assistant-ui** and powered by **Claude Sonnet 4.5** from Anthropic.

## Features

- 🤖 **Claude Sonnet 4.5 Integration** - Leverages Anthropic's most advanced AI model
- 💬 **Real-time Streaming Responses** - Fast, interactive chat experience
- 🎨 **Modern UI** - Built with assistant-ui and Tailwind CSS
- 📚 **Claude Skills System** - Structured expertise in 5 key areas:
  - Print Production & Specifications
  - Customer Service & Order Management
  - Design & Prepress Support
  - Product Knowledge
  - Technical Troubleshooting

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **UI Library**: assistant-ui
- **AI Provider**: Anthropic Claude API
- **Styling**: Tailwind CSS
- **AI SDK**: Vercel AI SDK with Anthropic adapter

## Prerequisites

- Node.js 18+ installed
- An Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com/))

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd printing-chatbot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the chatbot.

## Project Structure

```
printing-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Claude API integration endpoint
│   ├── components/
│   │   └── ChatInterface.tsx     # Main chat UI component
│   ├── globals.css               # Global styles + assistant-ui styles
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Home page
├── .env.local.example            # Environment variables template
└── README.md
```

## Key Components

### API Route (`app/api/chat/route.ts`)

- Integrates with Anthropic's Claude API
- Uses **claude-sonnet-4-5-20250514** model
- Implements streaming responses
- Includes comprehensive system prompt with Claude Skills

### Chat Interface (`app/components/ChatInterface.tsx`)

- Client-side component using assistant-ui
- Welcome screen with suggested prompts
- Real-time message streaming
- Responsive design

### Claude Skills System Prompt

The chatbot is configured with structured expertise in:

1. **Print Production & Specifications** - DPI, color modes, file formats, paper types
2. **Customer Service & Order Management** - Quoting, tracking, turnaround times
3. **Design & Prepress Support** - File preparation, proofing, color correction
4. **Product Knowledge** - Business cards, brochures, banners, packaging
5. **Technical Troubleshooting** - File issues, color matching, material selection

## Customization

### Modifying Claude Skills

Edit the `CLAUDE_SKILLS` constant in `app/api/chat/route.ts` to customize the assistant's expertise and behavior.

### Changing the Model

To use a different Claude model, update the model parameter in `app/api/chat/route.ts`:

```typescript
model: anthropic('claude-3-5-sonnet-20241022'), // or other Claude models
```

### Styling

- Global styles: `app/globals.css`
- Chat interface: `app/components/ChatInterface.tsx`
- Tailwind configuration: `tailwind.config.js`

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add your `ANTHROPIC_API_KEY` in the Environment Variables section
4. Deploy

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted with Node.js

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |

## Troubleshooting

### "API key not found" error

Make sure you've created a `.env.local` file with your Anthropic API key.

### Streaming not working

Check that your deployment platform supports streaming responses. Vercel, for example, requires proper configuration for streaming.

### Build errors

Try deleting `node_modules` and `.next`:

```bash
rm -rf node_modules .next
npm install
npm run dev
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [assistant-ui Documentation](https://docs.assistant-ui.com/)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/)

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
