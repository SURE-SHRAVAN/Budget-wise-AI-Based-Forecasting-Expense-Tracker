import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import StatCard from "../components/ui/statCard";
import { api } from "../lib/api";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const Home = () => {

  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    api.transactions.list().then(setTransactions);
  }, []);

  // =========================
  // 📊 BASIC CALCULATIONS
  // =========================
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const balance = income - expense;

  // =========================
  // 📊 BAR CHART DATA
  // =========================
  const barData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  // =========================
  // 🥧 PIE CHART DATA
  // =========================
  const categoryMap: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += Number(t.amount);
    }
  });

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  return (
    <Layout>

      {/* 🔢 STAT CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <StatCard title="Income" value={income} />
        <StatCard title="Expense" value={expense} />
        <StatCard title="Balance" value={balance} />
      </div>

      {/* 📊 CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 📊 BAR CHART */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Income vs Expense
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🥧 PIE CHART */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Spending by Category
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </Layout>
  );
};

export default Home;