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
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {/* Professional Header - Fixed */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Branding */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-md">
                  <span className="text-white text-xl font-bold">M</span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Commercial Printing Assistant
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                    <span>Powered by</span>
                    <span className="font-semibold text-indigo-600">Claude Sonnet 4.5</span>
                  </p>
                </div>
              </div>

              {/* Right: Status */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Chat Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto">
            <div className="h-full bg-white/60 backdrop-blur-sm shadow-xl rounded-none sm:rounded-2xl sm:m-4 border border-gray-200/50 overflow-hidden flex flex-col">
              <Thread />
            </div>
          </div>
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
}
