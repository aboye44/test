# Commercial Printing Assistant Chatbot

An AI-powered chatbot for commercial printing companies, built with **assistant-ui** and powered by **Claude Sonnet 4.5** from Anthropic.

## Features

- 🤖 **Claude Sonnet 4.5 Integration** - Uses `claude-sonnet-4-5-20250929` model
- 💬 **Real-time Streaming Responses** - Fast, interactive chat experience
- 🎨 **Modern UI** - Built with assistant-ui and Tailwind CSS
- 🧠 **Anthropic Skills API** - Properly configured with beta features:
  - Skills API (`skills-2025-10-02`)
  - Code Execution (`code-execution-2025-08-25`)
- 📚 **5 Claude Skills** - Structured expertise domains:
  - Print Production & Specifications
  - Customer Service & Order Management
  - Design & Prepress Support
  - Product Knowledge
  - Technical Troubleshooting
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

# 3. Upload Claude Skills (REQUIRED - do this first!)
npm run upload-skills
# Copy the skill IDs from the output

# 4. Update app/api/chat/route.ts
# Replace the SKILL_IDS array with your actual skill IDs

# 5. Run the app
npm run dev
```

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

### 4. Upload Claude Skills

This chatbot uses Anthropic's Skills API to load structured expertise. You need to upload the skills and get their IDs:

```bash
npm run upload-skills
```

This will:
- Upload 5 Claude Skills to your Anthropic account
- Display the skill IDs you need to use

**Important:** Copy the skill IDs from the output and replace the placeholder IDs in `app/api/chat/route.ts`:

```typescript
// Replace these placeholder IDs with your actual skill IDs
const SKILL_IDS = [
  'skill-abc123', // Print Production & Specifications
  'skill-def456', // Customer Service & Order Management
  'skill-ghi789', // Design & Prepress Support
  'skill-jkl012', // Product Knowledge
  'skill-mno345', // Technical Troubleshooting
];
```

### 5. Run the Development Server

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
├── scripts/
│   └── upload-skills.ts          # Upload Claude Skills to get IDs
├── .env.local.example            # Environment variables template
├── package.json                  # Dependencies + upload-skills script
└── README.md
```

## Key Components

### Skills Upload Script (`scripts/upload-skills.ts`)

- Uploads 5 Claude Skills to Anthropic's Skills API
- Each skill contains detailed instructions for a specific domain
- Returns skill IDs that are referenced in the API route
- Run with: `npm run upload-skills`

### API Route (`app/api/chat/route.ts`)

- Uses Anthropic SDK directly with `client.beta.messages.create()`
- Model: **claude-sonnet-4-5-20250929**
- Beta headers: `code-execution-2025-08-25,skills-2025-10-02`
- Container parameter with skills array (references uploaded skill IDs)
- Code execution tool enabled for calculations
- Custom streaming implementation compatible with AI SDK format

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

Skills are defined in `scripts/upload-skills.ts`. To modify:

1. Edit the skill definitions in the `skills` array
2. Run `npm run upload-skills` to re-upload with new IDs
3. Update the `SKILL_IDS` array in `app/api/chat/route.ts` with the new IDs

Each skill has:
- `name`: Display name of the skill
- `description`: Brief description of the skill's purpose
- `instructions`: Detailed instructions for Claude (can be very comprehensive)

### Managing Skills

**List your uploaded skills:**
```bash
# Use Anthropic API to list skills (coming soon in SDK)
```

**Update a skill:**
- Re-upload using the script (creates new IDs)
- Or use the Anthropic API to update existing skills

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
- Ensure you've run `npm run upload-skills` successfully
- Verify the skill IDs in `app/api/chat/route.ts` match the uploaded skills
- Skills are account-specific - use the same API key for upload and runtime

**Upload script fails:**
- Check your `ANTHROPIC_API_KEY` is set in `.env.local`
- Ensure you have beta feature access for Skills API
- Check the Anthropic console for any account limitations

**Beta headers not recognized:**
- Ensure you're using `@anthropic-ai/sdk` version 0.68.0 or higher
- Verify the beta header format: `'code-execution-2025-08-25,skills-2025-10-02'`

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
