import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { signOut, useAuth } from "@/lib/auth";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/participant")({
  component: ParticipantLayout,
});

function ParticipantLayout() {
  const { role, loading, username } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && role !== "participant" && role !== "admin") navigate({ to: "/login" });
  }, [loading, role, navigate]);

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
      <header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Brand to="/participant/dashboard" />
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{username}</span>
          <Button variant="ghost" size="sm" onClick={() => { signOut().then(() => navigate({ to: "/" })); }}>
            <LogOut className="h-4 w-4 mr-1" /> Sign out
          </Button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 pb-16">
        <Outlet />
      </main>
    </div>
  );
}
