import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/Toaster";
import { WalletContextProvider } from "@/components/WalletProvider";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "AI Tutor - Learn & Earn NFTs",
  description: "Learn blockchain technology with AI assistance and earn NFT achievements on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <WalletContextProvider>
          <Navigation />
          <Toaster />
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
