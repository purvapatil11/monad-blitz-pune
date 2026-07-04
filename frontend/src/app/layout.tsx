import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/config/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monad Uptime Protocol",
  description: "Decentralized, incentivized uptime oracle network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}