import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutGrid,
  MessagesSquare,
  Ticket,
  Headset,
  Info,
  ChevronDown,
  ArrowUpRight,
  Bell,
  Menu,
  X,
  FlaskConical,
  PanelLeftClose,
  CircleHelp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isMockMode } from "@/services/api";
import logo from "@/assets/assistiQ-logo.svg";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
const nav = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/chat", label: "AI web chat", icon: MessagesSquare },
  { to: "/portal", label: "Customer portal", icon: Ticket },
  { to: "/dashboard", label: "Support dashboard", icon: Headset },
  { to: "/about", label: "About AssistIQ", icon: Info },
] as const;
export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="app-shell">
      <aside className={cn("sidebar", open && "sidebar-open")}>
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src={logo} width="35" height="35" alt="" />
          <span>
            Assist<span className="text-primary">IQ</span>
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="workspace">
          <span className="workspace-avatar">A</span>
          <div>
            <strong>Acme workspace</strong>
            <span>Customer support</span>
          </div>
          <ChevronDown className="size-4 ml-auto text-muted-foreground" />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="nav-item"
              activeOptions={{ exact: true }}
              activeProps={{ className: "nav-item nav-active" }}
            >
              <Icon className="size-[18px]" />
              <span>{label}</span>
              {to === "/dashboard" && <span className="nav-count">3</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="flex items-center gap-2 text-primary text-sm font-semibold">
              <span className="online-dot" />A little more human.
            </span>
            <p>
              Intelligent support.
              <br />
              Meaningful connections.
            </p>
            <Link to="/about">
              Meet AssistIQ <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <Link to="/about" className="nav-item">
            <CircleHelp className="size-[18px]" />
            Help & resources
            <ArrowUpRight className="size-3.5 ml-auto" />
          </Link>
          <div className="profile">
            <span className="avatar">AL</span>
            <div>
              <strong>Alex Morgan</strong>
              <span>Workspace admin · Demo</span>
            </div>
            <PanelLeftClose className="size-4 text-muted-foreground" />
          </div>
        </div>
      </aside>
      {open && <div className="sidebar-scrim" onClick={() => setOpen(false)} />}
      <div className="main-shell">
        <header className="topbar">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close navigation" : "Open navigation"}
            >
              {open ? <X /> : <Menu />}
            </Button>
            <span className="text-muted-foreground text-sm hidden sm:inline">Workspace</span>
            <span className="text-muted-foreground hidden sm:inline">/</span>
            <span className="text-sm font-medium">
              {nav.find((n) => n.to === path)?.label ?? "AssistIQ"}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="demo-mode">
              <FlaskConical className="size-3.5" />
              {isMockMode ? "Demo workspace" : "API connected"}
            </span>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                onClick={() => setNotifications(!notifications)}
                className="notification-button"
              >
                <Bell className="size-[18px]" />
                <span className="notification-dot" />
              </Button>
              {notifications && (
                <div className="notification-popover">
                  <strong>Notifications</strong>
                  <p className="text-sm text-muted-foreground mt-3">
                    Demo: 3 escalated issues need a specialist.
                  </p>
                  <Link
                    to="/dashboard"
                    onClick={() => setNotifications(false)}
                    className="text-primary text-sm inline-block mt-3"
                  >
                    View support queue →
                  </Link>
                </div>
              )}
            </div>
            <span className="avatar avatar-small">AL</span>
          </div>
        </header>
        <main>{children}</main>
        <footer className="app-footer">
          <span>© 2026 AssistIQ</span>
          <span className="flex gap-2 items-center">
            <span className="online-dot" />
            {isMockMode
              ? "Demo data · Not connected to a live service"
              : "FastAPI service configured"}
          </span>
        </footer>
      </div>
    </div>
  );
}
