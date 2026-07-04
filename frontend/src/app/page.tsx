import Link from "next/link";
import { Navbar } from "@/components/navbar";
import {
  ShieldCheck,
  Radar,
  Coins,
  ArrowRight,
  Globe2,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FCFCFD] text-[#16141F]">
      <Navbar variant="marketing" />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pt-28">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8E7ED] bg-white px-3 py-1 text-xs font-medium text-[#6B6875]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0D8A5F] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0D8A5F]" />
              </span>
              Live on Monad Devnet
            </div>
            <h1 className="text-[2.75rem] font-semibold leading-[1.08] tracking-tight md:text-6xl">
              Decentralized
              <br />
              Uptime Oracles.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#6B6875]">
              Stop guessing if your website is down. Deposit MON into a smart contract to hire global, independent nodes that monitor your status and stake their own crypto on the results.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-[#7C5CFC] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6947E8]"
              >
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-[#16141F] underline decoration-[#E8E7ED] underline-offset-4 transition hover:decoration-[#16141F]"
              >
                See how it works
              </a>
            </div>

            <div className="mt-12 flex gap-10 border-t border-[#E8E7ED] pt-6">
              <div>
                <div className="text-2xl font-semibold">780+</div>
                <div className="text-xs text-[#6B6875]">MON pooled in escrow</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">3</div>
                <div className="text-xs text-[#6B6875]">verification regions</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">99.9%</div>
                <div className="text-xs text-[#6B6875]">network-wide SLA</div>
              </div>
            </div>
          </div>

          {/* Signature visual: regional consensus converging on a monitored target */}
          <ConsensusVisual />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-[#E8E7ED] bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#7C5CFC]">
            How It Works
          </h2>
          <p className="mt-2 max-w-lg text-2xl font-semibold tracking-tight">
            Trustless monitoring in three simple steps.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "Fund the Escrow",
                desc: "Register your website URL and deposit MON into a secure contract pool. This pool automatically funds rewards for honest nodes and processes payouts.",
                icon: <Coins className="h-5 w-5" />,
              },
              {
                step: "Independent Pings",
                desc: "Distributed tracking nodes across US-East, EU-West, and AP-South ping your site. Every node must stake collateral behind the accuracy of their report.",
                icon: <Radar className="h-5 w-5" />,
              },
              {
                step: "On-Chain Consensus",
                desc: "When multiple regions agree on the site status, it updates on-chain. If anyone submits a fake report, they lose their stake via community voting.",
                icon: <ShieldCheck className="h-5 w-5" />,
              },
            ].map((item, i) => (
              <div key={item.step} className="relative rounded-2xl border border-[#E8E7ED] p-6">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F1EEFE] text-[#7C5CFC]">
                  {item.icon}
                </div>
                <div className="mb-1 text-xs font-mono text-[#A6A3AD]">0{i + 1}</div>
                <h3 className="mb-2 text-base font-semibold">{item.step}</h3>
                <p className="text-sm leading-relaxed text-[#6B6875]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#7C5CFC]">
            Why It Matters
          </h2>
          <p className="mt-2 max-w-lg text-2xl font-semibold tracking-tight">
            Infrastructure built for absolute transparency.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Escrow-Backed Payouts",
                desc: "Your monitoring contracts run autonomously on-chain. Honest node operators can immediately claim rewards guaranteed by smart contracts.",
                icon: <Coins className="h-5 w-5 text-[#7C5CFC]" />,
              },
              {
                title: "Multi-Region Accuracy",
                desc: "No single server can claim your site is down. Status changes only update when independent global regions confirm the exact same state.",
                icon: <Globe2 className="h-5 w-5 text-[#7C5CFC]" />,
              },
              {
                title: "Permanent Incident History",
                desc: "Forget easily modified internal databases. Every status check, active dispute, and network resolution is logged permanently onto the ledger.",
                icon: <CheckCircle2 className="h-5 w-5 text-[#7C5CFC]" />,
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-[#FCFCFD] p-6">
                <div className="mb-4">{f.icon}</div>
                <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#6B6875]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="border-t border-[#E8E7ED] bg-[#16141F] py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-semibold text-white">Ready to secure your uptime?</h3>
            <p className="mt-2 text-sm text-[#A6A3AD]">
              Connect your web3 wallet and register your website monitor in under a minute.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#7C5CFC] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#8F73FF]"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#E8E7ED] py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-[#A6A3AD]">
          <span>© {new Date().getFullYear()} Pulse. Built on Monad.</span>
          <span>Devnet Preview — Prototype architecture for hackathon evaluation.</span>
        </div>
      </footer>
    </div>
  );
}

function ConsensusVisual() {
  const regions = [
    { name: "US-East", angle: -90 },
    { name: "EU-West", angle: 30 },
    { name: "AP-South", angle: 150 },
  ];
  const radius = 120;
  const center = 160;

  return (
    <div className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center">
      <svg viewBox="0 0 320 320" className="h-full w-full">
        {regions.map((r) => {
          const rad = (r.angle * Math.PI) / 180;
          const x = center + radius * Math.cos(rad);
          const y = center + radius * Math.sin(rad);
          return (
            <line
              key={r.name}
              x1={x}
              y1={y}
              x2={center}
              y2={center}
              stroke="#DCD6FF"
              strokeWidth={2}
              strokeDasharray="4 5"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="18"
                to="0"
                dur="1s"
                repeatCount="indefinite"
              />
            </line>
          );
        })}
        <circle cx={center} cy={center} r={34} fill="#F1EEFE" stroke="#7C5CFC" strokeWidth={2} />
      </svg>

      {/* Center target label */}
      <div className="absolute flex flex-col items-center">
        <ShieldCheck className="h-6 w-6 text-[#7C5CFC]" />
      </div>

      {/* Region nodes */}
      {regions.map((r) => {
        const rad = (r.angle * Math.PI) / 180;
        const x = center + radius * Math.cos(rad);
        const y = center + radius * Math.sin(rad);
        return (
          <div
            key={r.name}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: x, top: y }}
          >
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#0D8A5F] ring-4 ring-[#E7F8F1]" />
            <span className="whitespace-nowrap rounded-md border border-[#E8E7ED] bg-white px-2 py-0.5 font-mono text-[10px] text-[#6B6875] shadow-sm">
              {r.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}