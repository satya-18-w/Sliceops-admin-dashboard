import { cn } from "@/lib/utils";

/**
 * Platform brand mark — deliberately vertical-agnostic (no pizza/retail imagery).
 * Tenant-specific branding (Store logo) renders separately in the topbar tenant badge.
 */
export function AppLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white shadow-sm shadow-brand-500/30">
        S
      </div>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight text-neutral-800">
          Slice<span className="text-brand-500">Ops</span>
        </span>
      )}
    </div>
  );
}
