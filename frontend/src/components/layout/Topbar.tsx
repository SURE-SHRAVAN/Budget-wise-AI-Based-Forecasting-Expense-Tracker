import { LogOut, Menu, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import { Button } from "../ui/Button";

const mobileLinks = [
  ["/dashboard", "Dashboard"],
  ["/transactions", "Transactions"],
  ["/goals", "Goals"],
  ["/assistant", "AI"],
];

export const Topbar = () => {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="hidden min-h-11 flex-1 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.055] px-4 text-sm text-zinc-500 md:flex">
          <Search size={17} />
          Search transactions, goals, insights
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Menu size={20} />
          <span className="font-semibold">BudgetWise</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">{user?.first_name || user?.username}</p>
            <p className="text-xs text-zinc-500">{user?.currency ?? "INR"} workspace</p>
          </div>
          <Button variant="ghost" icon={<LogOut size={17} />} onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
        {mobileLinks.map(([to, label]) => (
          <NavLink
            className={({ isActive }) =>
              `rounded-full px-3 py-2 text-xs font-semibold ${isActive ? "bg-white text-black" : "bg-white/10 text-zinc-300"}`
            }
            key={to}
            to={to}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};
