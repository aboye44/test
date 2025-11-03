"use client";

import ReactMarkdown, { Components } from "react-markdown";
import type { FC } from "react";

// Accept any props that include a text property (matches TextMessagePartProps structure)
export const MarkdownText: FC<{ text: string; [key: string]: any }> = (props) => {
  const { text } = props;

  const components: Components = {
    // Headers with proper hierarchy and spacing
    h1: ({ children, ...props }) => (
      <h1
        className="text-2xl font-bold text-gray-900 mt-6 mb-3 pb-2 border-b-2 border-indigo-200"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-xl font-bold text-gray-900 mt-5 mb-2 flex items-center gap-2"
        {...props}
      >
        <span className="text-indigo-600">■</span>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="text-lg font-semibold text-gray-800 mt-4 mb-2"
        {...props}
      >
        {children}
      </h3>
    ),

    // Paragraphs with proper spacing
    p: ({ children, ...props }) => (
      <p className="mb-3 leading-relaxed text-gray-800" {...props}>
        {children}
      </p>
    ),

    // Lists with better styling
    ul: ({ children, ...props }) => (
      <ul className="list-none ml-1 mb-4 space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal ml-6 mb-4 space-y-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-gray-800 flex items-start gap-2" {...props}>
        <span className="text-indigo-500 mt-1 flex-shrink-0">•</span>
        <span>{children}</span>
      </li>
    ),

    // Tables with professional styling (for pricing breakdowns)
    table: ({ children, ...props }) => (
      <div className="my-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200 shadow-sm">
        <div className="overflow-x-auto">
          <table
            className="min-w-full divide-y divide-gray-300"
            {...props}
          >
            {children}
          </table>
        </div>
      </div>
    ),

    thead: ({ children, ...props }) => (
      <thead className="bg-white/50" {...props}>
        {children}
      </thead>
    ),

    tbody: ({ children, ...props }) => (
      <tbody className="divide-y divide-gray-200 bg-white/30" {...props}>
        {children}
      </tbody>
    ),

    tr: ({ children, ...props }) => (
      <tr className="hover:bg-white/50 transition-colors" {...props}>
        {children}
      </tr>
    ),

    th: ({ children, ...props }) => (
      <th
        className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ children, ...props }) => {
      // Check if this looks like a currency value and right-align it
      const text = String(children);
      const isCurrency = /^\$[\d,]+\.?\d*$/.test(text.trim());

      return (
        <td
          className={`px-4 py-3 text-sm ${
            isCurrency
              ? "text-right font-semibold text-gray-900 tabular-nums"
              : "text-gray-800"
          }`}
          {...props}
        >
          {children}
        </td>
      );
    },

    // Strong/bold text
    strong: ({ children, ...props }) => (
      <strong className="font-bold text-gray-900" {...props}>
        {children}
      </strong>
    ),

    // Italic text
    em: ({ children, ...props }) => (
      <em className="italic text-gray-700" {...props}>
        {children}
      </em>
    ),

    // Inline code
    code: ({ children, inline, ...props }: any) =>
      inline ? (
        <code
          className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      ) : (
        <code
          className="block p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto font-mono text-sm my-3 shadow-inner"
          {...props}
        >
          {children}
        </code>
      ),

    // Preformatted text
    pre: ({ children, ...props }) => (
      <pre className="my-4 overflow-x-auto" {...props}>
        {children}
      </pre>
    ),

    // Blockquotes
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-indigo-400 bg-indigo-50 pl-4 pr-4 py-3 my-4 italic text-gray-700 rounded-r-lg"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Horizontal rule
    hr: ({ ...props }) => (
      <hr
        className="my-6 border-t-2 border-gray-200"
        {...props}
      />
    ),

    // Links
    a: ({ children, ...props }) => (
      <a
        className="text-indigo-600 hover:text-indigo-800 underline font-medium transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
  };

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown components={components}>{text}</ReactMarkdown>
    </div>
  );
};
