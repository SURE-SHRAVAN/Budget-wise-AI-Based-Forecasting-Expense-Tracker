import React, { useState } from "react";
import { api } from "../../lib/api";

type Props = {
  onSuccess: () => void;
};

const TransactionForm = ({ onSuccess }: Props) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.transactions.create({
        amount: Number(amount),
        description: title.trim(),
        category: "General",
        type,
        date: new Date().toISOString().slice(0, 10),
      });

      setTitle("");
      setAmount("");
      setType("expense");

      onSuccess();
    } catch (error: any) {
      console.error("FULL ERROR:", error.response?.data || error);
    }
  };

  return (
    <div className="transaction-form">
      <h3>Add Transaction</h3>

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Transaction title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
};

export default TransactionForm;