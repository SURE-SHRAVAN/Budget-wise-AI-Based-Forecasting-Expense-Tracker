import { useState, type FormEvent } from "react";
import { api } from "../../services/api";
import type { Goal, GoalPayload } from "../../types/finance";
import { Button } from "../ui/Button";
import { Field, Input } from "../ui/Input";

const nextQuarter = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().slice(0, 10);

const GoalForm = ({ initial, onSuccess }: { initial?: Goal; onSuccess: () => void }) => {
  const [payload, setPayload] = useState<GoalPayload>({
    name: initial?.name ?? "",
    target_amount: initial ? Number(initial.target_amount) : 0,
    current_amount: initial ? Number(initial.current_amount) : 0,
    deadline: initial?.deadline ?? nextQuarter,
  });
  const [saving, setSaving] = useState(false);

  const setField = <K extends keyof GoalPayload>(key: K, value: GoalPayload[K]) => {
    setPayload((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (initial) {
        await api.goals.update(initial.id, payload);
      } else {
        await api.goals.create(payload);
      }
      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <Field label="Goal name">
        <Input required value={payload.name} onChange={(event) => setField("name", event.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Target amount">
          <Input min={1} required type="number" value={payload.target_amount || ""} onChange={(event) => setField("target_amount", Number(event.target.value))} />
        </Field>
        <Field label="Saved so far">
          <Input min={0} type="number" value={payload.current_amount || ""} onChange={(event) => setField("current_amount", Number(event.target.value))} />
        </Field>
      </div>
      <Field label="Deadline">
        <Input required type="date" value={payload.deadline} onChange={(event) => setField("deadline", event.target.value)} />
      </Field>
      <Button disabled={saving} type="submit">
        {saving ? "Saving..." : initial ? "Update goal" : "Create goal"}
      </Button>
    </form>
  );
};

export default GoalForm;
