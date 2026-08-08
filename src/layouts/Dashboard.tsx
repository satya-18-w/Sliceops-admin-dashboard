import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Bell, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";

import { useAuthStore } from "../store";
import { useLogoutUser } from "../hooks/useLogoutUser";
import { cn } from "@/lib/utils";
import { AppLogo } from "@/components/layout/AppLogo";
import { NavList } from "@/components/layout/NavList";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { getNavItems } from "@/components/layout/nav-items";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const { logoutMutate } = useLogoutUser();
  const location = useLocation();
  const { user } = useAuthStore();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  if (user === null) {
    return <Navigate to={`/auth/login?returnTo=${location.pathname}`} replace />;
  }

  const items = getNavItems(user.role);
  const initial = (user.name?.[0] ?? "U").toUpperCase();
  const contextLabel = user.role === "platform-admin" ? "Platform Control" : user.tenant?.name;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 border-r border-neutral-100 bg-white transition-[width] duration-200 ease-[var(--ease-lift)] md:flex md:flex-col",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-neutral-100 px-4", collapsed && "justify-center px-0")}>
          <AppLogo compact={collapsed} />
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <NavList items={collapsed ? items.map((i) => ({ ...i, label: "" })) : items} />
        </div>
        <div className="border-t border-neutral-100 p-3">
          <Button
            variant="ghost"
            size="icon"
            className="w-full justify-center"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
          </Button>
        </div>
      </aside>

      {/* Mobile nav drawer */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-16 items-center border-b border-neutral-100 px-4">
            <AppLogo />
          </div>
          <div className="py-4">
            <NavList items={items} onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center gap-3 border-b border-neutral-100 bg-white px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success-bg px-2.5 py-1 text-xs font-semibold text-success">
              <span className="pulse-dot size-1.5 rounded-full bg-success" />
              {contextLabel}
            </span>
          </div>

          <button
            onClick={() => setPaletteOpen(true)}
            className="ml-2 hidden flex-1 max-w-sm items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-400 transition-colors hover:border-neutral-300 sm:flex"
          >
            <Search className="size-4" />
            Search or jump to...
            <kbd className="ml-auto rounded border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-[18px]" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand-500" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                  <Avatar>
                    <AvatarFallback>{initial}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logoutMutate()}
                  className="text-danger data-[highlighted]:bg-danger-bg data-[highlighted]:text-danger"
                >
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <CommandPalette items={items} open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
};

export default Dashboard;
