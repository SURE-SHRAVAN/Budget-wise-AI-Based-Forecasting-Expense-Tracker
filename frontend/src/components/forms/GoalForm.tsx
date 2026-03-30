import React, { useState } from "react";
import { api } from "../../lib/api";

type Props = {
  onSuccess: () => void;
};

const GoalForm = ({ onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !targetAmount) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.goals.create({
        name: name.trim(),
        target_amount: Number(targetAmount),
        current_amount: 0,
        target_date: new Date().toISOString().slice(0, 10),
      });

      setName("");
      setTargetAmount("");

      onSuccess();
    } catch (error: any) {
      console.error("FULL ERROR:", error.response?.data || error);
    }
  };

  return (
    <div className="goal-form">
      <h3>Add Financial Goal</h3>

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Goal name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Target amount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />

        <button type="submit">Create Goal</button>
      </form>
    </div>
  );
};

export default GoalForm;