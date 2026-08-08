import { Home, Users, Store, Package, Tag, type LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function getNavItems(role: string): NavItem[] {
  const items: NavItem[] = [{ to: "/", label: "Home", icon: Home }];

  if (role === "platform-admin") {
    items.push({ to: "/restaurants", label: "Tenants", icon: Store });
    items.push({ to: "/users", label: "Users", icon: Users });
    return items;
  }

  if (role === "tenant-admin") {
    items.push({ to: "/users", label: "Users", icon: Users });
    items.push({ to: "/products", label: "Products", icon: Package });
    items.push({ to: "/promos", label: "Promos", icon: Tag });
    return items;
  }

  // manager / employee
  items.push({ to: "/products", label: "Products", icon: Package });
  items.push({ to: "/promos", label: "Promos", icon: Tag });
  return items;
}
