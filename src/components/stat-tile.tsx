import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatTileProps {
  label: string;
  value: string;
  trend?: { direction: "up" | "down"; label: string };
  icon?: LucideIcon;
}

export function StatTile({ label, value, trend, icon: Icon }: StatTileProps) {
  return (
    <Card className="p-5 hover:-translate-y-1 hover:border-brand-100 hover:shadow-lg hover:shadow-neutral-900/5">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-neutral-500">{label}</span>
        {Icon && <Icon className="size-4 text-neutral-300" />}
      </div>
      <div className="mt-2 text-[26px] font-bold tracking-tight text-neutral-800">{value}</div>
      {trend && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
              trend.direction === "up" ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
            )}
          >
            {trend.direction === "up" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
            {trend.label}
          </span>
          <span className="text-neutral-400">vs last week</span>
        </div>
      )}
    </Card>
  );
}
