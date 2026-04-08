import { Link, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  Calculator,
  LayoutDashboard,
  Settings,
  Target,
  TrendingUp,
} from "lucide-react";
import { useBackend } from "../hooks/useBackend";
import { formatNOK } from "../lib/format";
import { usePortfolioStore } from "../store/usePortfolioStore";
import { StatusBadge } from "./StatusBadge";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portfolio", label: "Portefølje", icon: Briefcase },
  { to: "/yield", label: "Yield", icon: TrendingUp },
  { to: "/goal", label: "Mål", icon: Target },
  { to: "/simulator", label: "Simulator", icon: Calculator },
  { to: "/innstillinger", label: "Innstillinger", icon: Settings },
] as const;

interface LayoutProps {
  children: React.ReactNode;
}

function Header() {
  const { summary, dataStatus } = usePortfolioStore();

  return (
    <header
      className="sticky top-0 z-40 bg-card border-b border-border shadow-sm"
      data-ocid="app-header"
    >
      <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-display font-bold text-base tracking-tight text-foreground shrink-0">
            Portfolio<span className="text-accent">NOK</span>
          </span>
          {summary && (
            <span className="hidden sm:block font-mono text-sm font-semibold text-foreground truncate">
              {formatNOK(summary.totalValueNOK)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {summary && (
            <span className="sm:hidden font-mono text-sm font-semibold text-foreground">
              {formatNOK(summary.totalValueNOK, true)}
            </span>
          )}
          <StatusBadge status={dataStatus} />
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pointer-events-auto"
      data-ocid="bottom-nav"
      aria-label="Hovednavigasjon"
    >
      <div className="grid grid-cols-6 h-16">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive =
            currentPath === to || currentPath.startsWith(`${to}/`);
          return (
            <Link
              key={to}
              to={to}
              className={`pointer-events-auto flex flex-col items-center justify-center gap-0.5 text-[10px] font-body transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
              data-ocid={`nav-${label.toLowerCase()}`}
            >
              <Icon
                className={`h-5 w-5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                aria-hidden
              />
              <span className="truncate max-w-full px-1">{label}</span>
            </Link>
          );
        })}
      </div>
      <div className="flex justify-center pb-1">
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.hostname : "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] text-muted-foreground/50 hover:text-muted-foreground transition-colors font-mono"
          data-ocid="mobile-caffeine-attribution"
        >
          caffeine.ai
        </a>
      </div>
    </nav>
  );
}

function SideNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0 bg-card border-r border-border"
      data-ocid="side-nav"
      aria-label="Sidemeny"
    >
      <div className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive =
            currentPath === to || currentPath.startsWith(`${to}/`);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
              aria-current={isActive ? "page" : undefined}
              data-ocid={`sidenav-${label.toLowerCase()}`}
            >
              <Icon
                className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-accent" : ""}`}
                aria-hidden
              />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="px-4 py-4 border-t border-border">
        <p className="text-[11px] text-muted-foreground font-mono">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </aside>
  );
}

export function Layout({ children }: LayoutProps) {
  // Initialize backend data fetching at layout level
  useBackend();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex flex-1 min-h-0">
        <SideNav />

        <main
          className="flex-1 overflow-y-auto pb-20 lg:pb-0"
          id="main-content"
          data-ocid="main-content"
        >
          <div className="max-w-5xl mx-auto px-4 py-4 lg:px-6 lg:py-6">
            {children}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
