import { useState, type FormEvent } from "react";
import { api } from "../../services/api";
import type { Transaction, TransactionPayload, TransactionType } from "../../types/finance";
import { Button } from "../ui/Button";
import { Field, Input, Select } from "../ui/Input";

const categories = ["Food", "Housing", "Transport", "Health", "Entertainment", "Software", "Salary", "Freelance", "Investments", "Other"];

const today = new Date().toISOString().slice(0, 10);

const TransactionForm = ({
  initial,
  onSuccess,
}: {
  initial?: Transaction;
  onSuccess: () => void;
}) => {
  const [payload, setPayload] = useState<TransactionPayload>({
    amount: initial ? Number(initial.amount) : 0,
    description: initial?.description ?? "",
    category: initial?.category ?? "Food",
    type: initial?.type ?? "expense",
    date: initial?.date ?? today,
  });
  const [saving, setSaving] = useState(false);

  const setField = <K extends keyof TransactionPayload>(key: K, value: TransactionPayload[K]) => {
    setPayload((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (initial) {
        await api.transactions.update(initial.id, payload);
      } else {
        await api.transactions.create(payload);
      }
      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <Field label="Description">
        <Input required value={payload.description} onChange={(event) => setField("description", event.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount">
          <Input min={1} required type="number" value={payload.amount || ""} onChange={(event) => setField("amount", Number(event.target.value))} />
        </Field>
        <Field label="Type">
          <Select value={payload.type} onChange={(event) => setField("type", event.target.value as TransactionType)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <Select value={payload.category} onChange={(event) => setField("category", event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Date">
          <Input required type="date" value={payload.date} onChange={(event) => setField("date", event.target.value)} />
        </Field>
      </div>
      <Button disabled={saving} type="submit">
        {saving ? "Saving..." : initial ? "Update transaction" : "Add transaction"}
      </Button>
    </form>
  );
};

export default TransactionForm;
