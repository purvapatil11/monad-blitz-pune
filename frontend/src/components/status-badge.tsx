// components/status-badge.tsx
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

type Status = "Healthy" | "Degraded" | "Down" | "ongoing" | "resolved";

const config: Record<Status, { label: string; bg: string; fg: string; icon: React.ReactNode }> = {
  Healthy: { label: "Healthy", bg: "bg-[#E7F8F1]", fg: "text-[#0D8A5F]", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  Degraded: { label: "Degraded", bg: "bg-[#FEF3E2]", fg: "text-[#B4740E]", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  Down: { label: "Down", bg: "bg-[#FDECEC]", fg: "text-[#C4373C]", icon: <XCircle className="h-3.5 w-3.5" /> },
  ongoing: { label: "Ongoing", bg: "bg-[#FDECEC]", fg: "text-[#C4373C]", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  resolved: { label: "Resolved", bg: "bg-[#E7F8F1]", fg: "text-[#0D8A5F]", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
};

export function StatusBadge({ status }: { status: Status }) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.fg}`}>
      {c.icon}
      {c.label}
    </span>
  );
}