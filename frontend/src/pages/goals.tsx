import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import GoalForm from "../components/forms/GoalForm";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../context/authcontext";
import { formatCurrency, formatDate } from "../lib/format";
import { api } from "../services/api";
import type { Goal } from "../types/finance";

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Goal | undefined>();

  const load = async () => setGoals(await api.goals.list());

  useEffect(() => {
    load();
  }, []);

  const closeModal = () => {
    setModal(null);
    setEditing(undefined);
  };

  const remove = async (goal: Goal) => {
    await api.goals.remove(goal.id);
    await load();
  };

  return (
    <div>
      <PageHeader action={<Button icon={<Plus size={17} />} onClick={() => setModal("create")}>Create goal</Button>} eyebrow="Planning" title="Goals" />

      {goals.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {goals.map((goal) => (
            <Card className="p-5" key={goal.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{goal.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">Deadline {formatDate(goal.deadline)}</p>
                </div>
                <div className="flex gap-2">
                  <button className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-zinc-300" onClick={() => { setEditing(goal); setModal("edit"); }} type="button">
                    <Pencil size={16} />
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-lg bg-red-500/10 text-red-200" onClick={() => remove(goal)} type="button">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-6 h-3 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-white" style={{ width: `${goal.progress_percentage}%` }} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Saved</p>
                  <p className="mt-1 font-semibold">{formatCurrency(goal.current_amount, user?.currency)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Target</p>
                  <p className="mt-1 font-semibold">{formatCurrency(goal.target_amount, user?.currency)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Left</p>
                  <p className="mt-1 font-semibold">{formatCurrency(goal.remaining_amount, user?.currency)}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-400">{goal.progress_percentage}% complete · {goal.days_remaining} days remaining</p>
            </Card>
          ))}
        </section>
      ) : (
        <EmptyState action={<Button onClick={() => setModal("create")}>Create first goal</Button>} title="No goals yet" text="Set targets for emergency funds, purchases, travel, or debt payoff." />
      )}

      <Modal onClose={closeModal} open={Boolean(modal)} title={modal === "edit" ? "Edit goal" : "Create goal"}>
        <GoalForm initial={editing} onSuccess={() => { closeModal(); load(); }} />
      </Modal>
    </div>
  );
};

export default Goals;
