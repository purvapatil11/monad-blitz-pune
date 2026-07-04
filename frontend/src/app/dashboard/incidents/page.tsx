// app/dashboard/incidents/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { StatusBadge } from "@/components/status-badge";
import { incidents as allIncidents } from "@/lib/mock-data";
import { ArrowLeft, Clock, MapPin } from "lucide-react";

type Filter = "all" | "ongoing" | "resolved";

export default function IncidentsPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return allIncidents;
    return allIncidents.filter((i) => i.status === filter);
  }, [filter]);

  const counts = {
    all: allIncidents.length,
    ongoing: allIncidents.filter((i) => i.status === "ongoing").length,
    resolved: allIncidents.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-[#16141F]">
      <Navbar variant="app" />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#6B6875] transition hover:text-[#16141F]">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </Link>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Incidents</h1>
            <p className="mt-1 text-sm text-[#6B6875]">
              Every downtime report that reached regional quorum, across all monitored sites.
            </p>
          </div>
        </div>

        <div className="mb-6 flex gap-1 rounded-lg border border-[#E8E7ED] bg-white p-1 w-fit">
          {(["all", "ongoing", "resolved"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium capitalize transition ${filter === f ? "bg-[#16141F] text-white" : "text-[#6B6875] hover:text-[#16141F]"}`}
            >
              {f} <span className="opacity-60">({counts[f]})</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E8E7ED] bg-white p-10 text-center text-sm text-[#A6A3AD]">
              No incidents in this view.
            </div>
          ) : (
            filtered.map((incident) => (
              <div key={incident.id} className="rounded-2xl border border-[#E8E7ED] bg-white p-5">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{incident.siteUrl}</h3>
                    <p className="mt-1 text-xs text-[#A6A3AD]">Site #{incident.siteId}</p>
                  </div>
                  <StatusBadge status={incident.status} />
                </div>

                <p className="mb-4 text-sm leading-relaxed text-[#6B6875]">{incident.note}</p>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#6B6875]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Started {formatTime(incident.startedAt)}
                  </span>
                  {incident.resolvedAt && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Resolved {formatTime(incident.resolvedAt)} · {incident.durationMinutes} min
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {incident.region}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}