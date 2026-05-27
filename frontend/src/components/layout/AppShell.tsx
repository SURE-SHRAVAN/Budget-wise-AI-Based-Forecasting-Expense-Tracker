import { Outlet } from "react-router-dom";
import { SideNavigation } from "./SideNavigation";
import { Topbar } from "./Topbar";

export const AppShell = () => (
  <div className="min-h-screen bg-primary text-ink">
    <div className="ambient-bg" />
    <div className="fixed inset-0 -z-10 bg-light-grid bg-[size:64px_64px] opacity-40" />
    <SideNavigation />
    <div className="min-h-screen lg:pl-72">
      <Topbar />
      <main className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  </div>
);
