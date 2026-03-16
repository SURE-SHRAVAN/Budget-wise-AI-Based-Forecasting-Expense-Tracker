import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  PieChart as PieIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import TransactionForm from "../components/forms/TransactionForm";

interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  date: string;
}

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchData = async () => {
    try {
      const [tData, gData] = await Promise.all([
        api.auth.transactions.list(),
        api.auth.goals.list(),
      ]);
      setTransactions(tData);
      setGoals(gData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categoryData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc: any[], t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) existing.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, []);

  const COLORS = ["#18181B", "#3F3F46", "#71717A", "#A1A1AA", "#D4D4D8"];

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="space-y-10 relative">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Financial Overview</h1>
          <p className="text-zinc-400">Track your spending and plan ahead</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border px-6 py-3 rounded-2xl text-sm font-bold">
            <Target size={18} />
            Set Goal
          </button>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-2xl text-sm font-bold"
          >
            <PlusCircle size={18} />
            New Transaction
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8">
        <StatCard title="Balance" value={balance} icon={<Wallet size={20} />} />
        <StatCard title="Income" value={totalIncome} icon={<TrendingUp size={20} />} />
        <StatCard title="Expenses" value={totalExpenses} icon={<TrendingDown size={20} />} />
      </div>

      {/* Chart */}
      <div className="bg-white p-8 rounded-[32px] shadow-xl">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <PieIcon size={20} />
          Spending Breakdown
        </h2>

        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-zinc-400">
            Add expenses to see breakdown
          </div>
        )}
      </div>

      {/* Modal */}
      {showAdd && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-2xl w-full max-w-md relative">
      <button
        onClick={() => setShowAdd(false)}
        className="absolute top-4 right-4 text-zinc-400 hover:text-black"
      >
        ✕
      </button>

      <TransactionForm
        onComplete={() => {
          setShowAdd(false);
          fetchData();
        }}
        onCancel={() => setShowAdd(false)}
      />
    </div>
    </div>
    )}
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => (
  <motion.div whileHover={{ y: -4 }} className="bg-white p-8 rounded-[32px] shadow-xl">
    <div className="flex justify-between mb-6">
      <span className="text-xs uppercase text-zinc-400">{title}</span>
      {icon}
    </div>
    <div className="text-3xl font-bold">${value.toLocaleString()}</div>
  </motion.div>
);

export default Dashboard;