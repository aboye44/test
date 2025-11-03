"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { Thread } from "./components/ui/assistant-ui/thread";

export default function Home() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
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

        {/* Chat Container with assistant-ui Thread */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
              <Thread />
            </div>
          </div>
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
}
