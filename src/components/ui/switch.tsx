import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

function Switch({ checked, onCheckedChange, label, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150 ease-[var(--ease-lift)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        checked ? "bg-brand-500" : "bg-neutral-200",
        className
      )}
    >
      <span
        className={cn(
          "inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform duration-150",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}

export { Switch };
