"use client";

import {
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";
import { MarkdownText } from "./markdown-text";

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col">
      <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto px-4 py-6">
        <ThreadPrimitive.Empty>
          <div className="flex flex-col items-center justify-center h-full">
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
                I'm here to help with commercial printing pricing, quotes, and cost analysis.
                Ask me anything!
              </p>
            </div>
          </div>
        </ThreadPrimitive.Empty>

        <div className="space-y-6">
          <ThreadPrimitive.Messages
            components={{
              UserMessage: UserMessage,
              AssistantMessage: AssistantMessage,
            }}
          />
        </div>
      </ThreadPrimitive.Viewport>

      <div className="border-t border-gray-200 bg-white p-4">
        <ComposerPrimitive.Root className="flex gap-2">
          <ComposerPrimitive.Input
            placeholder="Ask about pricing, quotes, or cost analysis..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <ComposerPrimitive.Send className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            Send
          </ComposerPrimitive.Send>
        </ComposerPrimitive.Root>
      </div>
    </ThreadPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <div className="flex justify-end">
      <div className="max-w-3xl bg-indigo-600 text-white px-4 py-3 rounded-lg">
        <MessagePrimitive.Content />
      </div>
    </div>
  );
};

const AssistantMessage: FC = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-3xl bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
      </div>
    </div>
  );
};
