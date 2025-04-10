import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TODO アプリ",
  description: "シンプルなTODOアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
