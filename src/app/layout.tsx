import type { Metadata } from "next";
import "@/app/globals.css";
import { ZeHeader } from "@/components/ZeHeader";

export const metadata: Metadata = {
  title: "Zero-Err",
  description: "Error-prevention document generation for ADHD-friendly workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <ZeHeader />
        {children}
      </body>
    </html>
  );
}
