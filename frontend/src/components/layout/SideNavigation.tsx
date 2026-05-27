import { Bot, ChartNoAxesCombined, Gauge, Goal, Landmark, Settings, Sparkles, UserRound, WalletCards } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/transactions", label: "Transactions", icon: WalletCards },
  { to: "/goals", label: "Goals", icon: Goal },
  { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const SideNavigation = () => (
  <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-line bg-white/80 p-5 backdrop-blur-xl lg:block">
    <NavLink to="/dashboard" className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-white shadow-md">
        <Landmark size={22} />
      </div>
      <div>
        <p className="text-lg font-semibold tracking-tight text-ink">BudgetWise AI</p>
        <p className="text-xs text-graphite">Financial intelligence</p>
      </div>
    </NavLink>

    <nav className="mt-10 grid gap-2">
      {navItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
              isActive ? "bg-accent text-white shadow-md" : "text-graphite hover:bg-secondary hover:text-ink"
            }`
          }
          key={item.to}
          to={item.to}
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}
    </nav>

    <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-line bg-gradient-to-br from-mint/10 to-transparent p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Sparkles size={16} className="text-mint" />
        AI insights active
      </div>
      <p className="mt-2 text-xs leading-5 text-graphite">Personalized analysis runs on your private transaction context.</p>
    </div>
  </aside>
);
