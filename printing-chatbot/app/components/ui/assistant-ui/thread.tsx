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
      {/* Messages Area - with generous padding and smooth scrolling */}
      <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ThreadPrimitive.Empty>
            <EmptyState />
          </ThreadPrimitive.Empty>

          <div className="space-y-6">
            <ThreadPrimitive.Messages
              components={{
                UserMessage: UserMessage,
                AssistantMessage: AssistantMessage,
              }}
            />
          </div>
        </div>
      </ThreadPrimitive.Viewport>

      {/* Input Area - Fixed bottom with shadow */}
      <div className="border-t border-gray-200 bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ComposerPrimitive.Root className="flex gap-3 items-end">
            <ComposerPrimitive.Input
              placeholder="Ask about pricing, quotes, or cost analysis..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl
                         focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100
                         resize-none transition-all duration-200
                         placeholder:text-gray-400 text-gray-900
                         disabled:bg-gray-50 disabled:cursor-not-allowed
                         min-h-[52px] max-h-[150px]"
              autoFocus
            />
            <ComposerPrimitive.Send className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600
                         text-white font-medium rounded-xl
                         hover:from-indigo-700 hover:to-blue-700
                         focus:ring-4 focus:ring-indigo-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-md hover:shadow-lg
                         active:scale-95 min-w-[80px]">
              Send
            </ComposerPrimitive.Send>
          </ComposerPrimitive.Root>
        </div>
      </div>
    </ThreadPrimitive.Root>
  );
};

// Empty State Component with example prompts
const EmptyState: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        {/* Icon */}
        <div className="text-7xl mb-4">🖨️</div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to MPA Printing Assistant
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Get instant pricing quotes for commercial printing jobs.
            Ask about postcards, booklets, direct mail, or any printing project.
          </p>
        </div>

        {/* Example Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <div className="p-5 bg-white border-2 border-gray-200 rounded-xl
                         hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md
                         transition-all duration-200 text-left group cursor-pointer">
            <div className="text-2xl mb-2">📮</div>
            <div className="font-semibold text-gray-900 mb-1">Postcard Pricing</div>
            <div className="text-sm text-gray-600">
              Quote 500 6×9 postcards
            </div>
          </div>

          <div className="p-5 bg-white border-2 border-gray-200 rounded-xl
                         hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md
                         transition-all duration-200 text-left group cursor-pointer">
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold text-gray-900 mb-1">Booklet Quote</div>
            <div className="text-sm text-gray-600">
              Price 100 16-page booklets
            </div>
          </div>

          <div className="p-5 bg-white border-2 border-gray-200 rounded-xl
                         hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md
                         transition-all duration-200 text-left group cursor-pointer">
            <div className="text-2xl mb-2">📧</div>
            <div className="font-semibold text-gray-900 mb-1">Direct Mail</div>
            <div className="text-sm text-gray-600">
              Cost for 1000 mailers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Message Component with gradient background
const UserMessage: FC = () => {
  return (
    <div className="flex justify-end animate-slide-in-right">
      <div className="max-w-[70%] bg-gradient-to-br from-indigo-600 to-blue-600
                      text-white px-5 py-3 rounded-2xl rounded-tr-md
                      shadow-md text-[15px] leading-relaxed">
        <MessagePrimitive.Content />
      </div>
    </div>
  );
};

// Assistant Message Component with professional styling
const AssistantMessage: FC = () => {
  return (
    <div className="flex justify-start animate-slide-in-left">
      <div className="max-w-[85%]">
        {/* Avatar and Name */}
        <div className="flex items-center gap-2 mb-2 ml-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500
                          flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            M
          </div>
          <span className="text-sm font-medium text-gray-700">Marcus</span>
        </div>

        {/* Message Content */}
        <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl rounded-tl-md
                        shadow-sm hover:shadow-md transition-shadow duration-200
                        text-gray-900 text-[15px]">
          <MessagePrimitive.Content
            components={{ Text: MarkdownText }}
          />
        </div>
      </div>
    </div>
  );
};
