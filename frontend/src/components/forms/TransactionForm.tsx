import React, { useState } from "react";
import { api } from "../lib/api";

interface Props {
  onComplete: () => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.transactions.create({
        amount: parseFloat(amount),
        description,
        category,
        type,
        date,
      });

      onComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        className="w-full p-4 rounded-2xl bg-zinc-50"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Description"
        className="w-full p-4 rounded-2xl bg-zinc-50"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <select
        className="w-full p-4 rounded-2xl bg-zinc-50"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>General</option>
        <option>Food</option>
        <option>Transport</option>
        <option>Shopping</option>
        <option>Salary</option>
      </select>

      <input
        type="date"
        className="w-full p-4 rounded-2xl bg-zinc-50"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-zinc-100 py-3 rounded-xl"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-zinc-900 text-white py-3 rounded-xl"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;