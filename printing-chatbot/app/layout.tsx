import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Commercial Printing Assistant",
  description: "AI-powered chatbot for commercial printing assistance, powered by Claude Sonnet 4.5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
