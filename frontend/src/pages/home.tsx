import { motion } from "framer-motion";
import { ArrowRight, Bot, ChartSpline, ShieldCheck, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

const features = [
  { icon: ChartSpline, title: "Predictive analytics", text: "Forecast spending, savings, and goal completion from your own cashflow." },
  { icon: Bot, title: "AI copilot", text: "Ask natural-language questions about affordability, categories, and savings pace." },
  { icon: ShieldCheck, title: "Private by design", text: "JWT-secured APIs, owner-scoped records, and context-aware AI boundaries." },
];

const Home = () => (
  <main className="min-h-screen overflow-hidden bg-black text-white">
    <section className="relative min-h-[92vh] px-5 py-6 sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.18),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,.18),transparent_22%),#050505]" />
      <div className="absolute inset-0 bg-luxury-grid bg-[size:72px_72px] opacity-20" />
      <nav className="relative z-10 flex items-center justify-between">
        <Link className="flex items-center gap-3" to="/">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-black">
            <WalletCards size={20} />
          </div>
          <span className="font-semibold">BudgetWise AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link className="hidden text-sm font-medium text-zinc-300 sm:block" to="/login">
            Login
          </Link>
          <Link to="/register">
            <Button icon={<ArrowRight size={17} />}>Start free</Button>
          </Link>
        </div>
      </nav>

      <div className="relative z-10 grid min-h-[78vh] items-center gap-10 pt-14 lg:grid-cols-[1fr_.9fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">AI-native personal finance</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
            Financial clarity for people who move fast.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            A premium financial intelligence platform for tracking money, forecasting outcomes, detecting overspending,
            and asking an AI copilot what your numbers really mean.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register">
              <Button icon={<ArrowRight size={17} />}>Create workspace</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Open dashboard</Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative min-h-[520px] rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-premium backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          <div className="absolute -inset-12 -z-10 rounded-full bg-white/10 blur-3xl" />
          <div className="grid gap-4">
            <div className="rounded-lg bg-white p-5 text-black">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Health score</p>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-6xl font-semibold">87</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">+11%</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Income", "Expenses"].map((label, index) => (
                <div className="rounded-lg border border-white/10 bg-black p-5" key={label}>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
                  <p className="mt-3 text-3xl font-semibold">{index === 0 ? "₹1.67L" : "₹69.2K"}</p>
                  <div className="mt-5 h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-white" style={{ width: index === 0 ? "82%" : "48%" }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-white/10 bg-black p-5">
              <p className="text-sm font-semibold">AI insight</p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Entertainment rose 32% this month. Your emergency fund remains on track if weekly discretionary spend stays below ₹8,500.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="-mt-6 grid gap-4 px-5 pb-16 sm:px-8 lg:grid-cols-3 lg:px-12">
      {features.map((feature) => (
        <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6" key={feature.title}>
          <feature.icon size={24} />
          <h2 className="mt-5 text-xl font-semibold">{feature.title}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.text}</p>
        </div>
      ))}
    </section>
  </main>
);

export default Home;
