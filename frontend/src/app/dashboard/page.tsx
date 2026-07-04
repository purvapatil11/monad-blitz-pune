// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { Navbar } from "@/components/navbar";
import { StatusBadge } from "@/components/status-badge";
import { sites as mockSites, statsFromSites, type Site } from "@/lib/mock-data";
import {
  Globe,
  Shield,
  Coins,
  Activity,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

export default function Dashboard() {
  const { isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const [activeTab, setActiveTab] = useState<"owner" | "worker">("owner");
  const [url, setUrl] = useState("");
  const [deposit, setDeposit] = useState("");
  const [selectedWebId, setSelectedWebId] = useState("1");
  const [pingRegion, setPingRegion] = useState("US-East");
  const [localSites, setLocalSites] = useState<Site[]>(mockSites);

  const { data: websiteCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "websiteCount",
  });

  const { data: websiteData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "websites",
    args: [BigInt(1)],
  });

  const handleRegister = async () => {
    if (!url || !deposit) return;
    try {
      if (isConnected) {
        writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "registerWebsite",
          args: [url],
          value: parseEther(deposit),
        });
      }
    } catch (e) {
      console.error("Contract transaction failed, using local fallback", e);
    }

    setLocalSites((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        url: url.replace(/^(https?:\/\/)?(www\.)?/, ""),
        poolMon: parseFloat(deposit),
        status: "Healthy",
        uptime30d: 100,
        regions: ["US-East", "EU-West", "AP-South"],
        pingHistory: [],
      },
    ]);
    setUrl("");
    setDeposit("");
  };

  const handleReport = async (isUp: boolean) => {
    const webIdNum = parseInt(selectedWebId);
    try {
      if (isConnected) {
        writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "reportUptime",
          args: [BigInt(webIdNum), pingRegion, isUp],
          value: parseEther("0.01"),
        });
      }
    } catch (e) {
      console.error("Contract transaction failed, updating local state", e);
    }

    setLocalSites((prev) =>
      prev.map((s) =>
        s.id === webIdNum
          ? {
              ...s,
              status: isUp ? "Healthy" : "Down",
              pingHistory: [
                ...s.pingHistory.slice(-9),
                { up: isUp, timestamp: new Date().toISOString(), region: pingRegion },
              ],
            }
          : s
      )
    );
  };

  const displayedSites: Site[] = websiteData
    ? [
        {
          ...localSites[0],
          url: (websiteData as any)[0] || localSites[0].url,
          poolMon: Number((websiteData as any)[2]) / 1e18,
          status: (websiteData as any)[3] ? "Healthy" : "Down",
        },
        ...localSites.slice(1),
      ]
    : localSites;

  const stats = statsFromSites(displayedSites);
  const totalMonitors = websiteCount ? Number(websiteCount) + displayedSites.length - 1 : stats.totalMonitors;

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-[#16141F]">
      <Navbar variant="app" />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-[#6B6875]">
              Monitor escrow-backed sites and submit regional verification reports.
            </p>
          </div>
          <Link
            href="/dashboard/incidents"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E7ED] bg-white px-3.5 py-2 text-sm font-medium text-[#16141F] transition hover:border-[#D6D2E0]"
          >
            View incidents
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total monitors" value={String(totalMonitors)} icon={<Globe className="h-4 w-4" />} />
          <StatCard label="Escrow pooled" value={`${stats.totalPool.toFixed(0)} MON`} icon={<Coins className="h-4 w-4" />} />
          <StatCard label="Avg. uptime (30d)" value={`${stats.avgUptime.toFixed(2)}%`} icon={<Activity className="h-4 w-4" />} />
          <StatCard
            label="Ongoing incidents"
            value={String(stats.ongoingIncidents)}
            icon={<AlertCircle className="h-4 w-4" />}
            tone={stats.ongoingIncidents > 0 ? "warn" : "default"}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#E8E7ED] bg-white p-5 lg:col-span-1">
            <div className="mb-5 flex gap-1 rounded-lg bg-[#FCFCFD] p-1">
              <TabButton active={activeTab === "owner"} onClick={() => setActiveTab("owner")} icon={<Globe className="h-3.5 w-3.5" />} label="Register" />
              <TabButton active={activeTab === "worker"} onClick={() => setActiveTab("worker")} icon={<Shield className="h-3.5 w-3.5" />} label="Report" />
            </div>

            {activeTab === "owner" ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-[#6B6875]">
                  Fund an escrow pool for a new site. Operators will begin cross-region verification once it's registered.
                </p>
                <Field label="Website URL">
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="api.protocol.network"
                    className="w-full rounded-lg border border-[#E8E7ED] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#7C5CFC]"
                  />
                </Field>
                <Field label="Escrow amount (MON)">
                  <input
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    type="number"
                    placeholder="0.5"
                    className="w-full rounded-lg border border-[#E8E7ED] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#7C5CFC]"
                  />
                </Field>
                <button
                  onClick={handleRegister}
                  className="w-full rounded-lg bg-[#7C5CFC] py-2.5 text-sm font-medium text-white transition hover:bg-[#6947E8] active:scale-[0.99]"
                >
                  Register site
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-[#6B6875]">
                  Submit a verification report from your operator node. Reports are staked with collateral.
                </p>
                <Field label="Target site">
                  <select
                    value={selectedWebId}
                    onChange={(e) => setSelectedWebId(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E7ED] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#7C5CFC]"
                  >
                    {displayedSites.map((s) => (
                      <option key={s.id} value={s.id}>
                        #{s.id} — {s.url}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Verification region">
                  <select
                    value={pingRegion}
                    onChange={(e) => setPingRegion(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E7ED] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#7C5CFC]"
                  >
                    <option value="US-East">US-East (Virginia)</option>
                    <option value="EU-West">EU-West (Frankfurt)</option>
                    <option value="AP-South">AP-South (Mumbai)</option>
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleReport(true)}
                    className="rounded-lg border border-[#B7E4D1] bg-[#E7F8F1] py-2.5 text-sm font-medium text-[#0D8A5F] transition hover:bg-[#D8F2E6] active:scale-[0.99]"
                  >
                    Report alive
                  </button>
                  <button
                    onClick={() => handleReport(false)}
                    className="rounded-lg border border-[#F5C4C6] bg-[#FDECEC] py-2.5 text-sm font-medium text-[#C4373C] transition hover:bg-[#FBDDDF] active:scale-[0.99]"
                  >
                    Report down
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#E8E7ED] bg-white lg:col-span-2">
            <div className="flex items-center justify-between border-b border-[#E8E7ED] px-5 py-4">
              <h2 className="text-sm font-semibold">Monitored sites</h2>
              <span className="text-xs text-[#A6A3AD]">{displayedSites.length} total</span>
            </div>
            <div className="divide-y divide-[#F1F0F4]">
              {displayedSites.map((site) => (
                <div key={site.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#FCFCFD] px-1.5 py-0.5 font-mono text-[10px] text-[#A6A3AD]">#{site.id}</span>
                      <h3 className="truncate text-sm font-medium">{site.url}</h3>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B6875]">
                      <span>Escrow: <span className="font-medium text-[#16141F]">{site.poolMon.toFixed(2)} MON</span></span>
                      <span>Uptime: <span className="font-medium text-[#16141F]">{site.uptime30d.toFixed(2)}%</span></span>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {(site.pingHistory.length ? site.pingHistory : Array(10).fill({ up: true })).map((p, i) => (
                        <div key={i} className={`h-4 w-1.5 rounded-sm ${p.up ? "bg-[#7FD1AC]" : "bg-[#F2A0A3]"}`} />
                      ))}
                    </div>
                  </div>
                  <StatusBadge status={site.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, tone = "default" }: { label: string; value: string; icon: React.ReactNode; tone?: "default" | "warn" }) {
  return (
    <div className="rounded-2xl border border-[#E8E7ED] bg-white p-4">
      <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${tone === "warn" ? "bg-[#FEF3E2] text-[#B4740E]" : "bg-[#F1EEFE] text-[#7C5CFC]"}`}>
        {icon}
      </div>
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-[#6B6875]">{label}</div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition ${active ? "bg-white text-[#16141F] shadow-sm" : "text-[#6B6875] hover:text-[#16141F]"}`}
    >
      {icon}
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[#6B6875]">{label}</label>
      {children}
    </div>
  );
}