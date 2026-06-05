import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, useAuth } from "@/lib/auth";
import { LayoutDashboard, ListChecks, Users, Trophy, LogOut, Menu } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin/dashboard", label: "Live monitor", icon: LayoutDashboard },
  { to: "/admin/quizzes", label: "Quiz settings", icon: ListChecks },
  { to: "/admin/participants", label: "Participants", icon: Users },
  { to: "/admin/results", label: "Results", icon: Trophy },
] as const;

function AdminLayout() {
  const { role, loading, username } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && role !== "admin") navigate({ to: "/login" });
  }, [loading, role, navigate]);

  // Close mobile drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  if (loading || role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const NavContent = (
    <>
      <div className="px-2 py-2"><Brand to="/admin/dashboard" /></div>
      <nav className="mt-6 space-y-1 flex-1">
        {NAV.map((n) => {
          const active = location.pathname.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}>
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border pt-3 mt-3">
        <div className="text-xs text-muted-foreground px-3">Signed in as</div>
        <div className="text-sm font-semibold px-3 truncate">{username}</div>
        <div className="flex items-center gap-1 mt-2">
          <Button variant="ghost" className="flex-1 justify-start" onClick={() => { signOut().then(() => navigate({ to: "/" })); }}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border bg-background/80 backdrop-blur px-4 py-3">
        <Brand to="/admin/dashboard" />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-4 flex flex-col bg-sidebar">
              {NavContent}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-sidebar p-4 flex-col">
        {NavContent}
      </aside>

      <main className="flex-1 overflow-auto min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
