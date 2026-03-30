import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import TransactionForm from "../components/forms/TransactionForm";
import GoalForm from "../components/forms/GoalForm";
import { api } from "../lib/api";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
};

type Goal = {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
};

const Finance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch data
  const fetchData = async () => {
    try {
      const transactionsData = await api.transactions.list();
      const goalsData = await api.goals.list();

      setTransactions(transactionsData || []);
      setGoals(goalsData || []);
    } catch (error: any) {
      console.error("❌ Fetch Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ FIXED (no async → no TS error)
  const handleTransactionAdded = () => {
    fetchData();
  };

  const handleGoalAdded = () => {
    fetchData();
  };

  if (loading) {
    return (
      <Layout>
        <h2>Loading Financial Data...</h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="finance-container">

        <h1>Financial Overview</h1>

        {/* ================= TRANSACTIONS ================= */}
        <TransactionForm onSuccess={handleTransactionAdded} />

        <div className="transactions-section">
          <h2>Transactions</h2>

          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <ul>
              {transactions.map((t) => (
                <li key={t.id}>
                  <strong>{t.description}</strong> — ₹{t.amount} ({t.type}) on{" "}
                  {new Date(t.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ================= GOALS ================= */}
        <GoalForm onSuccess={handleGoalAdded} />

        <div className="goals-section">
          <h2>Financial Goals</h2>

          {goals.length === 0 ? (
            <p>No goals added yet.</p>
          ) : (
            <ul>
              {goals.map((g) => (
                <li key={g.id}>
                  <strong>{g.name}</strong> — Saved ₹{g.current_amount} / ₹{g.target_amount}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Finance;