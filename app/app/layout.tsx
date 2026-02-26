import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/Toaster";
import { WalletContextProvider } from "@/components/WalletProvider";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "AI Tutor - Learn & Earn NFTs",
  description: "Learn blockchain technology with AI assistance and earn NFT achievements on Solana",
  keywords: ["AI", "blockchain", "NFT", "Solana", "learn", "Web3"],
  openGraph: {
    title: "AI Tutor - Learn & Earn NFTs",
    description: "Learn blockchain technology with AI assistance and earn NFT achievements on Solana",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme initializer — runs before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[var(--bg)] min-h-screen overflow-x-hidden">
        <WalletContextProvider>
          <Navigation />
          <main className="min-h-screen pt-28 lg:pt-16 pb-6">
            {children}
          </main>
          <Toaster />
        </WalletContextProvider>
      </body>
    </html>
  );
}
