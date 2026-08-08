import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-items";

export function NavList({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              )
            }
          >
            <Icon className="size-[18px] shrink-0" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
