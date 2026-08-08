import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export interface Crumb {
  label: string;
  to?: string;
}

export function PageHeader({
  crumbs,
  actions,
}: {
  crumbs: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <nav className="flex items-center gap-1.5 text-sm text-neutral-500">
        {crumbs.map((crumb, i) => (
          <span key={crumb.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 text-neutral-300" />}
            {crumb.to ? (
              <Link to={crumb.to} className="hover:text-brand-500">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-neutral-800">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
