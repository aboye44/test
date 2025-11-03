"use client";

import ReactMarkdown, { Components } from "react-markdown";
import type { FC } from "react";

// Accept any props that include a text property (matches TextMessagePartProps structure)
export const MarkdownText: FC<{ text: string; [key: string]: any }> = (props) => {
  const { text } = props;
  const components: Components = {
    // Customize markdown components for better pricing display
    h1: ({ children, ...props }) => (
      <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-900" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-xl font-bold mt-3 mb-2 text-gray-900" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-lg font-semibold mt-2 mb-1 text-gray-900" {...props}>{children}</h3>
    ),
    p: ({ children, ...props }) => (
      <p className="mb-2 text-gray-900" {...props}>{children}</p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc ml-6 mb-2 space-y-1" {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal ml-6 mb-2 space-y-1" {...props}>{children}</ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-gray-900" {...props}>{children}</li>
    ),
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-300 border border-gray-300" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-gray-50" {...props}>{children}</thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className="divide-y divide-gray-200 bg-white" {...props}>{children}</tbody>
    ),
    tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
    th: ({ children, ...props }) => (
      <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border border-gray-300" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300" {...props}>
        {children}
      </td>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-bold text-gray-900" {...props}>{children}</strong>
    ),
    em: ({ children, ...props }) => <em className="italic" {...props}>{children}</em>,
    code: ({ children, ...props }) => (
      <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono text-gray-900" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3" {...props}>
        {children}
      </pre>
    ),
  };

  return (
    <ReactMarkdown components={components}>
      {text}
    </ReactMarkdown>
  );
};
