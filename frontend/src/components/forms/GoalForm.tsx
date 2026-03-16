import React, { useState } from "react";
import { api } from "../lib/api";

interface Props {
  onComplete: () => void;
  onCancel: () => void;
}

const GoalForm: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.auth.goals.create({
        name,
        target_amount: parseFloat(targetAmount),
        target_date: targetDate,
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
        type="text"
        placeholder="Goal Name"
        className="w-full p-4 rounded-2xl bg-zinc-50"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Target Amount"
        className="w-full p-4 rounded-2xl bg-zinc-50"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        required
      />

      <input
        type="date"
        className="w-full p-4 rounded-2xl bg-zinc-50"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
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
          {loading ? "Saving..." : "Set Goal"}
        </button>
      </div>
    </form>
  );
};

export default GoalForm;