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
    <header className="sticky top-0 z-30 border-b border-line bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="hidden min-h-11 flex-1 items-center gap-3 rounded-lg border border-line bg-secondary px-4 text-sm text-graphite focus-within:ring-2 focus-within:ring-accent/50 md:flex transition-all shadow-sm">
          <Search size={17} />
          <input 
            type="text" 
            placeholder="Search transactions, goals, insights" 
            className="w-full bg-transparent outline-none placeholder:text-graphite/70 text-ink"
          />
        </div>

        <div className="flex items-center gap-2 lg:hidden text-ink">
          <Menu size={20} />
          <span className="font-semibold">BudgetWise</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ink">{user?.first_name || user?.username || "Guest"}</p>
            <p className="text-xs text-graphite">{user?.currency ?? "INR"} workspace</p>
          </div>
          <Button variant="ghost" icon={<LogOut size={17} />} onClick={logout} className="text-graphite hover:text-ink hover:bg-secondary">
            Logout
          </Button>
        </div>
      </div>

      <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
        {mobileLinks.map(([to, label]) => (
          <NavLink
            className={({ isActive }) =>
              `rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition ${isActive ? "bg-accent text-white" : "bg-secondary text-graphite hover:bg-platinum"}`
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
