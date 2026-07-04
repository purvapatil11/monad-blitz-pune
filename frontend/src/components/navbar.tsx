// components/navbar.tsx
"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function Navbar({ variant = "marketing" }: { variant?: "marketing" | "app" }) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E7ED] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C5CFC]">
            <Activity className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#16141F]">Oracle</span>
          {variant === "app" && (
            <span className="ml-1 rounded-md bg-[#F1EEFE] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#7C5CFC]">
              Devnet
            </span>
          )}
        </Link>

        {variant === "marketing" ? (
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm text-[#6B6875] transition hover:text-[#16141F]">How it works</a>
            <a href="#features" className="text-sm text-[#6B6875] transition hover:text-[#16141F]">Features</a>
            <a href="https://github.com/purvapatil11/Oracle" target="_blank" rel="noreferrer" className="text-sm text-[#6B6875] transition hover:text-[#16141F]">GitHub</a>
          </nav>
        ) : (
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/dashboard" className="text-sm text-[#6B6875] transition hover:text-[#16141F]">Dashboard</Link>
            <Link href="/dashboard/incidents" className="text-sm text-[#6B6875] transition hover:text-[#16141F]">Incidents</Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          {variant === "marketing" ? (
            <Link href="/dashboard" className="rounded-lg bg-[#16141F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2A2735]">
              Launch App
            </Link>
          ) : isConnected ? (
            <div className="flex items-center gap-2 rounded-lg border border-[#E8E7ED] bg-[#FCFCFD] p-1 pr-1">
              <span className="rounded-md bg-white px-2.5 py-1.5 font-mono text-xs text-[#16141F] shadow-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button onClick={() => disconnect()} className="rounded-md px-2.5 py-1.5 text-xs font-medium text-[#C4373C] transition hover:bg-[#FDECEC]">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={() => connect({ connector: injected() })} className="rounded-lg bg-[#7C5CFC] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6947E8]">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}