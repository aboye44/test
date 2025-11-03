'use client';

import { Thread } from '@assistant-ui/react';
import { useChat } from 'ai/react';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useVercelUseChatRuntime } from '@assistant-ui/react-ai-sdk';

export default function ChatInterface() {
  const chat = useChat({
    api: '/api/chat',
  });

  const runtime = useVercelUseChatRuntime(chat);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Commercial Printing Assistant
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Powered by Claude Sonnet 4.5
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Online
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
            {/* Welcome Message */}
            {chat.messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="max-w-2xl text-center space-y-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-8 h-8 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome to Your Printing Assistant
                  </h2>
                  <p className="text-gray-600">
                    I'm here to help with print production, specifications, customer service,
                    design support, and technical troubleshooting. Ask me anything about commercial
                    printing!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <button
                      onClick={() =>
                        chat.setInput('What are the file requirements for printing business cards?')
                      }
                      className="p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <p className="font-medium text-gray-900">File Requirements</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Learn about print specifications
                      </p>
                    </button>
                    <button
                      onClick={() => chat.setInput('How do I prepare a file for large format printing?')}
                      className="p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <p className="font-medium text-gray-900">Large Format</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Banner and signage guidance
                      </p>
                    </button>
                    <button
                      onClick={() => chat.setInput('What paper types do you recommend for brochures?')}
                      className="p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <p className="font-medium text-gray-900">Paper Selection</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Choose the right materials
                      </p>
                    </button>
                    <button
                      onClick={() => chat.setInput('My colors don\'t match. What should I check?')}
                      className="p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <p className="font-medium text-gray-900">Color Matching</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Troubleshoot color issues
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Thread */}
            <AssistantRuntimeProvider runtime={runtime}>
              <div className="flex-1 overflow-auto">
                <Thread />
              </div>
            </AssistantRuntimeProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
