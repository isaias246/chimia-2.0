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
  Scale
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: Activity },
  { href: "/periodic-table", label: "Periodic Table", icon: Grid },
  { href: "/molecular-mass", label: "Molecular Mass", icon: Calculator },
  { href: "/compound-builder", label: "Compound Builder", icon: Beaker },
  { href: "/equation-balancer", label: "Equation Balancer", icon: Scale },
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
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Beaker className="h-6 w-6 text-primary" />
          <span className="font-bold tracking-tight">CHEMIA</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 hidden md:flex items-center gap-3">
          <Beaker className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl tracking-wider text-primary">CHEMIA</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} title="Log out">
                <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Sign in to save data</p>
              <Link href="/login">
                <Button variant="outline" className="w-full justify-center">Log In</Button>
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
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
