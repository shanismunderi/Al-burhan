import { r as reactExports, W as jsxRuntimeExports, a2 as Outlet } from "./_ssr/server-qf1JXDzt.mjs";
import { u as useAuth, a as useNavigate } from "./_ssr/router-DzvbJLgE.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_ssr/client-NeI7WRgn.mjs";
function AuthLayout() {
  const {
    session,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && !session) navigate({
      to: "/login"
    });
  }, [loading, session, navigate]);
  if (loading || !session) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground", children: "Loading…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
}
export {
  AuthLayout as component
};
