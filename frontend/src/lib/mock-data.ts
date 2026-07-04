// lib/mock-data.ts
export type PingSample = { up: boolean; timestamp: string; region: string };

export type Site = {
  id: number;
  url: string;
  poolMon: number;
  status: "Healthy" | "Degraded" | "Down";
  uptime30d: number;
  pingHistory: PingSample[];
  regions: string[];
};

export type Incident = {
  id: string;
  siteId: number;
  siteUrl: string;
  status: "ongoing" | "resolved";
  region: string;
  startedAt: string;
  resolvedAt?: string;
  durationMinutes?: number;
  note: string;
};

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();

export const sites: Site[] = [
  {
    id: 1,
    url: "aurexstudios.xyz",
    poolMon: 450,
    status: "Healthy",
    uptime30d: 99.98,
    regions: ["US-East", "EU-West", "AP-South"],
    pingHistory: [
      { up: true, timestamp: hoursAgo(10), region: "US-East" },
      { up: true, timestamp: hoursAgo(9), region: "EU-West" },
      { up: true, timestamp: hoursAgo(8), region: "AP-South" },
      { up: true, timestamp: hoursAgo(7), region: "US-East" },
      { up: true, timestamp: hoursAgo(6), region: "EU-West" },
      { up: false, timestamp: hoursAgo(5), region: "AP-South" },
      { up: true, timestamp: hoursAgo(4), region: "US-East" },
      { up: true, timestamp: hoursAgo(3), region: "EU-West" },
      { up: true, timestamp: hoursAgo(2), region: "AP-South" },
      { up: true, timestamp: hoursAgo(1), region: "US-East" },
    ],
  },
  {
    id: 2,
    url: "explorer.monad.xyz",
    poolMon: 120,
    status: "Healthy",
    uptime30d: 100,
    regions: ["US-East", "EU-West", "AP-South"],
    pingHistory: Array.from({ length: 10 }, (_, i) => ({
      up: true,
      timestamp: hoursAgo(10 - i),
      region: ["US-East", "EU-West", "AP-South"][i % 3],
    })),
  },
  {
    id: 3,
    url: "api.protocol.network",
    poolMon: 210,
    status: "Down",
    uptime30d: 97.42,
    regions: ["US-East", "EU-West", "AP-South"],
    pingHistory: [
      { up: true, timestamp: hoursAgo(10), region: "US-East" },
      { up: true, timestamp: hoursAgo(9), region: "EU-West" },
      { up: false, timestamp: hoursAgo(8), region: "AP-South" },
      { up: false, timestamp: hoursAgo(7), region: "US-East" },
      { up: false, timestamp: hoursAgo(6), region: "EU-West" },
      { up: true, timestamp: hoursAgo(5), region: "AP-South" },
      { up: false, timestamp: hoursAgo(4), region: "US-East" },
      { up: false, timestamp: hoursAgo(3), region: "EU-West" },
      { up: false, timestamp: hoursAgo(2), region: "AP-South" },
      { up: false, timestamp: hoursAgo(1), region: "US-East" },
    ],
  },
];

export const incidents: Incident[] = [
  {
    id: "inc-1",
    siteId: 3,
    siteUrl: "api.protocol.network",
    status: "ongoing",
    region: "EU-West, US-East",
    startedAt: hoursAgo(4),
    note: "Consensus from 2 of 3 regions reports connection timeout.",
  },
  {
    id: "inc-2",
    siteId: 1,
    siteUrl: "aurexstudios.xyz",
    status: "resolved",
    region: "AP-South",
    startedAt: hoursAgo(5),
    resolvedAt: hoursAgo(4.5),
    durationMinutes: 30,
    note: "Single-region report, not confirmed by quorum. Auto-resolved.",
  },
  {
    id: "inc-3",
    siteId: 2,
    siteUrl: "explorer.monad.xyz",
    status: "resolved",
    region: "US-East",
    startedAt: hoursAgo(96),
    resolvedAt: hoursAgo(95.6),
    durationMinutes: 24,
    note: "Brief RPC node restart, resolved before SLA breach threshold.",
  },
  {
    id: "inc-4",
    siteId: 3,
    siteUrl: "api.protocol.network",
    status: "resolved",
    region: "AP-South",
    startedAt: hoursAgo(72),
    resolvedAt: hoursAgo(70.8),
    durationMinutes: 72,
    note: "Upstream provider outage. Escrow penalty released to operators.",
  },
];

export function statsFromSites(list: Site[]) {
  const totalPool = list.reduce((sum, s) => sum + s.poolMon, 0);
  const avgUptime = list.reduce((sum, s) => sum + s.uptime30d, 0) / (list.length || 1);
  const ongoing = incidents.filter((i) => i.status === "ongoing").length;
  return { totalMonitors: list.length, totalPool, avgUptime, ongoingIncidents: ongoing };
}