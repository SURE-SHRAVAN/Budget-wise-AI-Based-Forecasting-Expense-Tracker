import { motion } from "framer-motion";
import { Bot, CreditCard, PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { MonthlyAreaChart, CategoryPieChart } from "../components/charts/FinancialCharts";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";
import { useAuth } from "../context/authcontext";
import { formatCurrency, formatDate, percentageTone } from "../lib/format";
import { useDashboardData } from "../hooks/useDashboardData";

const Dashboard = () => {
  const { user } = useAuth();
  const { goals, loading, report, transactions } = useDashboardData();

  if (loading || !report) {
    return (
      <div className="grid gap-5">
        <Skeleton className="h-36" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Balance", value: formatCurrency(report.overview.balance, user?.currency), icon: Wallet, tone: "text-white" },
    { label: "Income", value: formatCurrency(report.overview.income, user?.currency), icon: TrendingUp, tone: "text-emerald-300" },
    { label: "Expenses", value: formatCurrency(report.overview.expenses, user?.currency), icon: TrendingDown, tone: "text-red-300" },
    { label: "Savings", value: `${report.overview.savings_rate}%`, icon: PiggyBank, tone: percentageTone(report.overview.savings_rate) },
  ];

  return (
    <div>
      <PageHeader
        action={
          <Link to="/assistant">
            <Button icon={<Bot size={18} />}>Ask AI</Button>
          </Link>
        }
        eyebrow="Financial command center"
        title={`Good to see you, ${user?.first_name || user?.username}.`}
      />

      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }} key={stat.label} transition={{ delay: index * 0.05 }}>
            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite">{stat.label}</p>
                <stat.icon className={stat.tone} size={20} />
              </div>
              <p className={`mt-5 text-3xl font-semibold tracking-tight text-ink`}>{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Monthly analytics</p>
              <h2 className="mt-2 text-xl font-semibold">Income, expenses, and savings</h2>
            </div>
            <Badge tone={report.overview.financial_health_score > 75 ? "success" : "warning"}>
              Score {report.overview.financial_health_score}
            </Badge>
          </div>
          <MonthlyAreaChart data={report.monthly_trends} />
        </Card>

        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Category intelligence</p>
          <h2 className="mt-2 text-xl font-semibold">Expense split</h2>
          {report.category_breakdown.length ? <CategoryPieChart data={report.category_breakdown} /> : <EmptyState title="No spending yet" text="Add expense transactions to activate category analytics." />}
        </Card>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">AI insights</h2>
            <Link className="text-sm font-semibold text-zinc-300" to="/analytics">
              View report
            </Link>
          </div>
          <div className="grid gap-3">
            {report.insights.length ? (
              report.insights.slice(0, 4).map((insight) => (
                <div className="rounded-lg border border-line bg-secondary p-4" key={insight.title}>
                  <Badge tone={insight.severity === "info" ? "neutral" : insight.severity}>{insight.type}</Badge>
                  <h3 className="mt-3 font-semibold text-ink">{insight.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-graphite">{insight.detail}</p>
                </div>
              ))
            ) : (
              <EmptyState title="No insights yet" text="More transactions will unlock behavioral intelligence." />
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent timeline</h2>
            <Link className="text-sm font-semibold text-zinc-300" to="/transactions">
              Manage
            </Link>
          </div>
          <div className="grid gap-3">
            {transactions.slice(0, 6).map((transaction) => (
              <div className="flex items-center justify-between gap-4 rounded-lg border border-line bg-secondary p-4" key={transaction.id}>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-white shadow-sm border border-line">
                    <CreditCard size={18} className="text-graphite" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{transaction.description}</p>
                    <p className="text-xs text-graphite">
                      {transaction.category} · {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <p className={transaction.type === "income" ? "text-emerald-300" : "text-red-300"}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount, user?.currency)}
                </p>
              </div>
            ))}
            {!transactions.length && <EmptyState title="No transactions" text="Add your first transaction to build a financial timeline." />}
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        {goals.slice(0, 3).map((goal) => (
          <Card className="p-5" key={goal.id}>
            <p className="font-semibold text-ink">{goal.name}</p>
            <div className="mt-4 h-2 rounded-full bg-platinum">
              <div className="h-full rounded-full bg-accent" style={{ width: `${goal.progress_percentage}%` }} />
            </div>
            <p className="mt-3 text-sm text-graphite">
              {goal.progress_percentage}% complete · {formatCurrency(goal.remaining_amount, user?.currency)} left
            </p>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
