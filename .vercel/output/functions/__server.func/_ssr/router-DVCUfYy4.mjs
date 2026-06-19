import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-PopuJf90.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./server-DSnt8QHz.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function formatDisplayName(displayName, username) {
  if (!displayName) return username || "";
  const trimmed = displayName.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        const teamName = parsed.teamName || parsed.name || parsed.display_name || "";
        const college = parsed.college || "";
        if (teamName && college) {
          return `${teamName} (${college})`;
        }
        return teamName || displayName;
      }
    } catch (e) {
    }
  }
  return displayName;
}
function usernameToEmail(input) {
  const u = input.trim().toLowerCase();
  if (u.includes("@")) {
    const [local, domain] = u.split("@");
    if (domain.includes(".")) return u;
    return `${local}@${domain}.local`;
  }
  return `${u}@quiz.local`;
}
async function signInWithUsername(username, password) {
  return supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password
  });
}
async function signInWithCode(code) {
  const c = code.trim().toUpperCase();
  const email = `code-${c.toLowerCase()}@quiz.local`;
  return supabase.auth.signInWithPassword({ email, password: c });
}
async function signOut() {
  await supabase.auth.signOut();
}
const AuthContext = reactExports.createContext({
  session: null,
  user: null,
  role: null,
  username: null,
  member1: null,
  member2: null,
  loading: true
});
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [role, setRole] = reactExports.useState(null);
  const [username, setUsername] = reactExports.useState(null);
  const [member1, setMember1] = reactExports.useState(null);
  const [member2, setMember2] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const currentUserRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    let mounted = true;
    const handleUserChange = async (user) => {
      const uid = user?.id ?? null;
      console.log(
        "[AuthProvider] handleUserChange: uid =",
        uid,
        "current =",
        currentUserRef.current
      );
      if (uid && uid === currentUserRef.current) {
        console.log("[AuthProvider] handleUserChange: no change, returning");
        return;
      }
      currentUserRef.current = uid;
      if (uid) {
        setLoading(true);
        try {
          console.log("[AuthProvider] Fetching role and profile for uid:", uid);
          const [{ data: roles }, { data: profile }] = await Promise.all([
            supabase.from("user_roles").select("role").eq("user_id", uid),
            supabase.from("profiles").select("username, display_name, member1_name, member2_name").eq("id", uid).maybeSingle()
          ]);
          console.log("[AuthProvider] Fetched: roles =", roles, "profile =", profile);
          if (!mounted) {
            console.log("[AuthProvider] handleUserChange: not mounted, returning");
            return;
          }
          if (currentUserRef.current !== uid) {
            console.log("[AuthProvider] handleUserChange: uid changed, returning");
            return;
          }
          const r = roles?.find((x) => x.role === "admin") ? "admin" : roles?.[0]?.role ?? null;
          console.log("[AuthProvider] Resolved role:", r);
          setRole(r ?? null);
          const p = profile;
          setUsername(formatDisplayName(p?.display_name, p?.username) || null);
          setMember1(p?.member1_name ?? null);
          setMember2(p?.member2_name ?? null);
        } catch (error) {
          console.error("[AuthProvider] Failed to load user info:", error);
        } finally {
          if (mounted && currentUserRef.current === uid) {
            console.log("[AuthProvider] Setting loading to false");
            setLoading(false);
          }
        }
      } else {
        console.log("[AuthProvider] No uid, clearing state");
        setRole(null);
        setUsername(null);
        setMember1(null);
        setMember2(null);
        setLoading(false);
      }
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      handleUserChange(s?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      handleUserChange(data.session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return reactExports.createElement(
    AuthContext.Provider,
    { value: { session, user: session?.user ?? null, role, username, member1, member2, loading } },
    children
  );
}
function useAuth() {
  return reactExports.useContext(AuthContext);
}
const appCss = "/assets/styles-Djq8kXhv.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$e = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Al-Burhan 2.0 — National Grand Quiz Competition" },
      {
        name: "description",
        content: "Darul Hasanath Islamic College's National Grand Quiz Competition on Islamic Civilization & Ihsan."
      },
      { name: "author", content: "Darul Hasanath Islamic College" },
      { property: "og:title", content: "Al-Burhan 2.0 — National Grand Quiz Competition" },
      {
        property: "og:description",
        content: "Darul Hasanath Islamic College's National Grand Quiz Competition on Islamic Civilization & Ihsan."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Al-Burhan 2.0 — National Grand Quiz Competition" },
      {
        name: "twitter:description",
        content: "Darul Hasanath Islamic College's National Grand Quiz Competition on Islamic Civilization & Ihsan."
      },
      {
        property: "og:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/eec4ff74-a77b-4b37-a66e-4ff8329e408a/id-preview-cd9bd56d--ff1e24cf-3f7c-480d-8780-e93fd2ffc9fc.lovable.app-1780894023079.png"
      },
      {
        name: "twitter:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/eec4ff74-a77b-4b37-a66e-4ff8329e408a/id-preview-cd9bd56d--ff1e24cf-3f7c-480d-8780-e93fd2ffc9fc.lovable.app-1780894023079.png"
      }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
      }
    ],
    scripts: [
      {
        children: `(function(){try{var t=localStorage.getItem('theme')||'light';if(t==='dark'){document.documentElement.classList.add('dark');}document.documentElement.style.colorScheme=t;}catch(e){}})();`
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", style: { colorScheme: "light" }, suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$e.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] }) });
}
const $$splitComponentImporter$d = () => import("./login-CdTT8mGZ.mjs");
const Route$d = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("../_authenticated-JI1pK0uH.mjs");
const Route$c = createFileRoute("/_authenticated")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const logoHero = "/assets/logo-hero-BfZPLwnb.png";
const $$splitComponentImporter$b = () => import("./index-BKtr3eyR.mjs");
const Route$b = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component"),
  head: () => ({
    meta: [{
      title: "Al-Burhan 2.0 — National Grand Quiz Competition"
    }, {
      name: "description",
      content: "Darul Hasanath Islamic College's National Grand Quiz on Islamic Civilization & Ihsan. Cash prizes ₹6,666."
    }],
    links: [{
      rel: "preload",
      as: "image",
      href: logoHero,
      fetchPriority: "high"
    }]
  })
});
const $$splitComponentImporter$a = () => import("./admin.login-CUUSuYsI.mjs");
const Route$a = createFileRoute("/admin/login")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./participant-C3--VS43.mjs");
const Route$9 = createFileRoute("/_authenticated/participant")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin-CfpVCl75.mjs");
const Route$8 = createFileRoute("/_authenticated/admin")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./dashboard-aBfsPz0M.mjs");
const Route$7 = createFileRoute("/_authenticated/participant/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./results-CNPk14Xu.mjs");
const Route$6 = createFileRoute("/_authenticated/admin/results")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./quizzes-DPmmvTaE.mjs");
const Route$5 = createFileRoute("/_authenticated/admin/quizzes")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./participants-DGfaV0xx.mjs");
const Route$4 = createFileRoute("/_authenticated/admin/participants")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./dashboard-aFybowtX.mjs");
const Route$3 = createFileRoute("/_authenticated/admin/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./result._attemptId-sVH7mgs8.mjs");
const Route$2 = createFileRoute("/_authenticated/participant/result/$attemptId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./quiz._quizId-PSfmbFox.mjs");
const Route$1 = createFileRoute("/_authenticated/participant/quiz/$quizId")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./questions._quizId-tTFME4KT.mjs");
const Route = createFileRoute("/_authenticated/admin/questions/$quizId")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const LoginRoute = Route$d.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$e
});
const AuthenticatedRoute = Route$c.update({
  id: "/_authenticated",
  getParentRoute: () => Route$e
});
const IndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$e
});
const AdminLoginRoute = Route$a.update({
  id: "/admin/login",
  path: "/admin/login",
  getParentRoute: () => Route$e
});
const AuthenticatedParticipantRoute = Route$9.update({
  id: "/participant",
  path: "/participant",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAdminRoute = Route$8.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedParticipantDashboardRoute = Route$7.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedParticipantRoute
});
const AuthenticatedAdminResultsRoute = Route$6.update({
  id: "/results",
  path: "/results",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminQuizzesRoute = Route$5.update({
  id: "/quizzes",
  path: "/quizzes",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminParticipantsRoute = Route$4.update({
  id: "/participants",
  path: "/participants",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminDashboardRoute = Route$3.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedParticipantResultAttemptIdRoute = Route$2.update({
  id: "/result/$attemptId",
  path: "/result/$attemptId",
  getParentRoute: () => AuthenticatedParticipantRoute
});
const AuthenticatedParticipantQuizQuizIdRoute = Route$1.update({
  id: "/quiz/$quizId",
  path: "/quiz/$quizId",
  getParentRoute: () => AuthenticatedParticipantRoute
});
const AuthenticatedAdminQuestionsQuizIdRoute = Route.update({
  id: "/questions/$quizId",
  path: "/questions/$quizId",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminRouteChildren = {
  AuthenticatedAdminDashboardRoute,
  AuthenticatedAdminParticipantsRoute,
  AuthenticatedAdminQuizzesRoute,
  AuthenticatedAdminResultsRoute,
  AuthenticatedAdminQuestionsQuizIdRoute
};
const AuthenticatedAdminRouteWithChildren = AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren);
const AuthenticatedParticipantRouteChildren = {
  AuthenticatedParticipantDashboardRoute,
  AuthenticatedParticipantQuizQuizIdRoute,
  AuthenticatedParticipantResultAttemptIdRoute
};
const AuthenticatedParticipantRouteWithChildren = AuthenticatedParticipantRoute._addFileChildren(
  AuthenticatedParticipantRouteChildren
);
const AuthenticatedRouteChildren = {
  AuthenticatedAdminRoute: AuthenticatedAdminRouteWithChildren,
  AuthenticatedParticipantRoute: AuthenticatedParticipantRouteWithChildren
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  LoginRoute,
  AdminLoginRoute
};
const routeTree = Route$e._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$1 as R,
  signInWithUsername as a,
  signOut as b,
  cn as c,
  Route as d,
  formatDisplayName as f,
  logoHero as l,
  router as r,
  signInWithCode as s,
  useAuth as u
};
