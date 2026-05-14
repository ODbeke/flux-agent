import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Flux Agent — 0G AI Research & Permanent Storage Vault",
  description: "Decentralized AI research synthesis layer powered by 0G mainnet. Execute inference, permanently archive on 0G Storage, and mint unique Agent IDs verifiable onchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#050508] text-[#f3f4f6]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
