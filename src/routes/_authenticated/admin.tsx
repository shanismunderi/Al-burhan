import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { signOut, useAuth } from "@/lib/auth";
import { LayoutDashboard, ListChecks, Users, Trophy, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin/dashboard", label: "Live monitor", icon: LayoutDashboard },
  { to: "/admin/quizzes", label: "Quizzes", icon: ListChecks },
  { to: "/admin/participants", label: "Participants", icon: Users },
  { to: "/admin/results", label: "Results", icon: Trophy },
] as const;

function AdminLayout() {
  const { role, loading, username } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!loading && role !== "admin") navigate({ to: "/login" });
  }, [loading, role, navigate]);

  if (loading || role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r border-border bg-sidebar p-4 flex flex-col">
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
          <Button variant="ghost" className="w-full justify-start mt-2" onClick={() => { signOut().then(() => navigate({ to: "/" })); }}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
