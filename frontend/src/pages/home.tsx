import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import StatCard from "../components/ui/statCard";
import { api } from "../lib/api";

const Home = () => {

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.transactions.list().then(setTransactions);
  }, []);

  const income = transactions
    .filter((t: any) => t.type === "income")
    .reduce((a: number, b: any) => a + Number(b.amount), 0);

  const expense = transactions
    .filter((t: any) => t.type === "expense")
    .reduce((a: number, b: any) => a + Number(b.amount), 0);

  const balance = income - expense;

  return (
    <Layout>

      <div className="grid grid-cols-3 gap-6">

        <StatCard title="Income" value={income} />

        <StatCard title="Expense" value={expense} />

        <StatCard title="Balance" value={balance} />

      </div>

    </Layout>
  );
};

export default Home;