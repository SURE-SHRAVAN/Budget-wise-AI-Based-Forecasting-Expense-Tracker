import { Activity, Brain, TrendingUp } from "lucide-react";
import { CategoryPieChart, HeatmapBars, MonthlyAreaChart, SpendingBarChart } from "../components/charts/FinancialCharts";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";
import { useAuth } from "../context/authcontext";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatCurrency } from "../lib/format";

const Analytics = () => {
  const { user } = useAuth();
  const { loading, report } = useDashboardData();

  if (loading || !report) return <Skeleton className="h-[620px]" />;

  return (
    <div>
      <PageHeader eyebrow="Intelligence layer" title="Analytics and forecasting" />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <Activity className="text-emerald-300" />
          <p className="mt-4 text-sm text-zinc-500">Predicted monthly savings</p>
          <p className="mt-2 text-3xl font-semibold">{formatCurrency(report.forecasts.monthly_savings_prediction, user?.currency)}</p>
        </Card>
        <Card className="p-5">
          <TrendingUp className="text-white" />
          <p className="mt-4 text-sm text-zinc-500">6 month projection</p>
          <p className="mt-2 text-3xl font-semibold">{formatCurrency(report.forecasts.six_month_savings_projection, user?.currency)}</p>
        </Card>
        <Card className="p-5">
          <Brain className="text-amber-300" />
          <p className="mt-4 text-sm text-zinc-500">Anomalies detected</p>
          <p className="mt-2 text-3xl font-semibold">{report.forecasts.anomalies.length}</p>
        </Card>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <Card className="p-5">
          <h2 className="text-xl font-semibold">Monthly trend analysis</h2>
          <p className="mt-1 text-sm text-zinc-500">Income, expenses, and savings over time.</p>
          <div className="mt-4">
            <MonthlyAreaChart data={report.monthly_trends} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-semibold">Category mix</h2>
          {report.category_breakdown.length ? <CategoryPieChart data={report.category_breakdown} /> : <EmptyState title="No categories" text="Expense categories appear here." />}
        </Card>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-xl font-semibold">Top spending categories</h2>
          <div className="mt-4">
            <SpendingBarChart data={report.category_breakdown} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-semibold">Expense heatmap</h2>
          <p className="mt-1 text-sm text-zinc-500">Weekday concentration by spend volume.</p>
          <div className="mt-6">
            <HeatmapBars data={report.expense_heatmap} />
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        {report.insights.map((insight) => (
          <Card className="p-5" key={insight.title}>
            <Badge tone={insight.severity === "info" ? "neutral" : insight.severity}>{insight.type}</Badge>
            <h3 className="mt-4 text-lg font-semibold">{insight.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{insight.detail}</p>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default Analytics;
