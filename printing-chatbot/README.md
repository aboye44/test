# Commercial Printing Assistant Chatbot

An AI-powered chatbot for commercial printing companies, built with **assistant-ui** and powered by **Claude Sonnet 4.5** from Anthropic.

## Features

- 🤖 **Claude Sonnet 4.5 Integration** - Uses `claude-sonnet-4-5-20250929` model
- 💬 **Real-time Streaming Responses** - Fast, interactive chat experience
- 🎨 **Modern UI** - Built with assistant-ui and Tailwind CSS
- 🧠 **Anthropic Skills API** - Properly configured with beta features:
  - Skills API (`skills-2025-10-02`)
  - Code Execution (`code-execution-2025-08-25`)
- 📊 **MPA Pricing Skill** - Pre-configured with custom skill for commercial printing pricing
- ⚡ **Code Execution Tool** - Claude can execute Python code for calculations and analysis

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **UI Library**: assistant-ui
- **AI Provider**: Anthropic Claude API
- **Styling**: Tailwind CSS
- **AI SDK**: Vercel AI SDK with Anthropic adapter

## Prerequisites

- Node.js 18+ installed
- An Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com/))
- Beta feature access for Skills API (available to all Anthropic accounts)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 3. Run the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the chatbot.

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
│   │       └── route.ts          # Claude API integration with Skills API
│   ├── components/
│   │   └── ChatInterface.tsx     # Main chat UI component
│   ├── globals.css               # Global styles + assistant-ui styles
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Home page
├── .env.local.example            # Environment variables template
├── package.json                  # Dependencies
└── README.md
```

## Key Components

### API Route (`app/api/chat/route.ts`)

- Uses Anthropic SDK directly with `client.beta.messages.create()`
- Model: **claude-sonnet-4-5-20250929**
- Beta headers: `code-execution-2025-08-25,skills-2025-10-02`
- Container parameter with MPA Pricing skill (`skill_017itBMGuP8s5xPH2K683nDy`)
- Code execution tool enabled for calculations
- Custom streaming implementation compatible with AI SDK format

**Skills Configuration:**
```typescript
container: {
  skills: [
    {
      type: 'custom',
      skill_id: 'skill_017itBMGuP8s5xPH2K683nDy', // MPA Pricing skill
      version: 'latest',
    },
  ],
}
```

### Chat Interface (`app/components/ChatInterface.tsx`)

- Client-side component using assistant-ui
- Welcome screen with suggested prompts
- Real-time message streaming
- Responsive design

### MPA Pricing Skill

The chatbot uses a custom MPA Pricing skill that provides:
- Commercial printing pricing expertise
- Quote calculations and estimates
- Material cost analysis
- Production cost optimization

## Customization

### Using Different Skills

To use a different skill ID, update `app/api/chat/route.ts`:

```typescript
container: {
  skills: [
    {
      type: 'custom',
      skill_id: 'your-skill-id-here',
      version: 'latest',
    },
  ],
}
```

You can also use multiple skills by adding more objects to the skills array.

### Managing Skills

Skills can be created and managed through the Anthropic API or Console. Each skill contains:
- `name`: Display name of the skill
- `description`: Brief description of the skill's purpose
- `instructions`: Detailed instructions for Claude

### Changing the Model

To use a different Claude model, update in `app/api/chat/route.ts`:

```typescript
model: 'claude-3-5-sonnet-20241022', // or other Claude models
```

**Note:** Skills API requires models that support the beta features.

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

### Skills API Issues

**"Skill not found" error:**
- Verify the skill ID in `app/api/chat/route.ts` is correct
- Skills are account-specific - ensure your API key has access to the skill
- Check that the skill ID exists in your Anthropic account

**Beta headers not recognized:**
- Ensure you're using `@anthropic-ai/sdk` version 0.68.0 or higher
- Verify the beta header format: `'code-execution-2025-08-25,skills-2025-10-02'`

**Skill version issues:**
- The `version: 'latest'` parameter uses the most recent version of the skill
- You can also specify a specific version number if needed

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
