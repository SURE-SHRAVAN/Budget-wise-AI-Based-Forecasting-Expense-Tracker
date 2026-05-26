import { Outlet } from "react-router-dom";
import { SideNavigation } from "./SideNavigation";
import { Topbar } from "./Topbar";

export const AppShell = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.16),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,.16),transparent_22%),#050505]" />
    <div className="fixed inset-0 -z-10 bg-luxury-grid bg-[size:64px_64px] opacity-20" />
    <SideNavigation />
    <div className="min-h-screen lg:pl-72">
      <Topbar />
      <main className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  </div>
);
