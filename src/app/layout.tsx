import type { Metadata } from "next";
import { Inter, Roboto, Poppins, Montserrat, MuseoModerno } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const museo = MuseoModerno({
  subsets: ["latin"],
  variable: "--font-museo",
});

export const metadata: Metadata = {
  title: "Flux Agent — The Future of Verifiable AI Research",
  description: "Luxury AI synthesis meets decentralized 0G storage. Generate, preserve, and verify ownership of your research on the permanent mesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} ${roboto.variable} ${poppins.variable} ${montserrat.variable} ${museo.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
