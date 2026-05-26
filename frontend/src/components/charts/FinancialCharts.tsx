import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsReport } from "../../types/finance";

const palette = ["#ffffff", "#a1a1aa", "#34d399", "#fbbf24", "#f87171", "#60a5fa", "#c084fc"];

const tooltipStyle = {
  background: "#050505",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 8,
  color: "#fff",
};

export const MonthlyAreaChart = ({ data }: { data: AnalyticsReport["monthly_trends"] }) => (
  <ResponsiveContainer height={280} width="100%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id="income" x1="0" x2="0" y1="0" y2="1">
          <stop offset="5%" stopColor="#ffffff" stopOpacity={0.35} />
          <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="expenses" x1="0" x2="0" y1="0" y2="1">
          <stop offset="5%" stopColor="#f87171" stopOpacity={0.35} />
          <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
      <XAxis axisLine={false} dataKey="month" tick={{ fill: "#71717a", fontSize: 12 }} tickLine={false} />
      <YAxis axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} tickLine={false} width={42} />
      <Tooltip contentStyle={tooltipStyle} />
      <Area dataKey="income" fill="url(#income)" stroke="#ffffff" strokeWidth={2} type="monotone" />
      <Area dataKey="expenses" fill="url(#expenses)" stroke="#f87171" strokeWidth={2} type="monotone" />
    </AreaChart>
  </ResponsiveContainer>
);

export const CategoryPieChart = ({ data }: { data: AnalyticsReport["category_breakdown"] }) => (
  <ResponsiveContainer height={260} width="100%">
    <PieChart>
      <Pie data={data} dataKey="value" innerRadius={68} outerRadius={100} paddingAngle={4} nameKey="category">
        {data.map((entry, index) => (
          <Cell fill={palette[index % palette.length]} key={entry.category} />
        ))}
      </Pie>
      <Tooltip contentStyle={tooltipStyle} />
    </PieChart>
  </ResponsiveContainer>
);

export const SpendingBarChart = ({ data }: { data: AnalyticsReport["category_breakdown"] }) => (
  <ResponsiveContainer height={280} width="100%">
    <BarChart data={data.slice(0, 7)}>
      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
      <XAxis axisLine={false} dataKey="category" tick={{ fill: "#71717a", fontSize: 12 }} tickLine={false} />
      <YAxis axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} tickLine={false} width={42} />
      <Tooltip contentStyle={tooltipStyle} />
      <Bar dataKey="value" fill="#ffffff" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const HeatmapBars = ({ data }: { data: AnalyticsReport["expense_heatmap"] }) => (
  <div className="grid grid-cols-7 gap-2">
    {data.map((item) => {
      const max = Math.max(...data.map((entry) => entry.value), 1);
      const opacity = Math.max(0.18, item.value / max);
      return (
        <div className="grid gap-2 text-center" key={item.day}>
          <div className="h-24 rounded-lg border border-white/10 bg-white/10 p-1">
            <div className="h-full rounded-md bg-white" style={{ opacity }} />
          </div>
          <span className="text-xs text-zinc-500">{item.day}</span>
        </div>
      );
    })}
  </div>
);
