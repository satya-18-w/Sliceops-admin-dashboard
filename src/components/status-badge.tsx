import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT = {
  preparing: "warning",
  "on the way": "info",
  delivered: "success",
  cancelled: "danger",
} as const;

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANT[status as keyof typeof STATUS_VARIANT] ?? "neutral";
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}
