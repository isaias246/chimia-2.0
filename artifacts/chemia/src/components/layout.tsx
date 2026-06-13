import React from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  Beaker,
  Calculator,
  Grid,
  Library,
  LogOut,
  Menu,
  MessageSquare,
  Scale,
  Hexagon,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/smart-solver", label: "Smart Solver", icon: Sparkles, featured: true },
  { href: "/", label: "Dashboard", icon: Activity },
  { href: "/periodic-table", label: "Periodic Table", icon: Grid },
  { href: "/molecular-mass", label: "Molecular Mass", icon: Calculator },
  { href: "/compound-builder", label: "Compound Builder", icon: Beaker },
  { href: "/equation-balancer", label: "Equation Balancer", icon: Scale },
  { href: "/stoichiometry", label: "Stoichiometry", icon: FlaskConical },
  { href: "/ai-tutor", label: "AI Tutor", icon: MessageSquare },
  { href: "/saved-formulas", label: "Saved Formulas", icon: Library },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-sidebar">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Hexagon className="h-6 w-6 text-primary glow-primary rounded-full" />
            <span className="font-bold tracking-tight text-gradient-cyan">CHEMIA</span>
          </div>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 md:w-60 bg-sidebar border-r border-cyan-500/10 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/">
          <div className="p-6 hidden md:flex items-center gap-3 cursor-pointer">
            <Hexagon className="h-7 w-7 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
            <span className="font-bold text-xl tracking-wider text-gradient-cyan">CHEMIA</span>
          </div>
        </Link>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <div className="mb-4 mt-2 px-3">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Tools</span>
          </div>
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const isFeatured = (item as { featured?: boolean }).featured;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm font-medium ${
                    isActive && isFeatured
                      ? "border-l-2 border-primary bg-primary/15 text-primary shadow-[0_0_12px_rgba(0,229,255,0.1)]"
                      : isActive
                      ? "border-l-2 border-primary bg-primary/10 text-primary"
                      : isFeatured
                      ? "text-primary/80 hover:bg-primary/10 hover:text-primary border border-primary/20 bg-primary/5"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={`h-4 w-4 ${isFeatured && !isActive ? "text-primary/70" : ""}`} />
                  {item.label}
                  {isFeatured && !isActive && (
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-primary/60 bg-primary/10 px-1.5 py-0.5 rounded-full border border-primary/20">
                      NEW
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 relative">
          <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground opacity-50">v1.0</div>
          {user ? (
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold shrink-0 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} title="Log out" className="hover:bg-destructive/10">
                <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 pb-4">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full text-xs h-8 border-primary/20 hover:bg-primary/10 hover:text-primary">Sign In</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full text-xs h-8 bg-primary/90 hover:bg-primary text-primary-foreground">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-background">
        <div className="px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
