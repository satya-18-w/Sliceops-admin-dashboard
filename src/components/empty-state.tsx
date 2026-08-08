import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Icon className="size-8 text-neutral-300" />
      <p className="text-sm font-medium text-neutral-600">{title}</p>
      {description && <p className="text-sm text-neutral-400">{description}</p>}
    </div>
  );
}
