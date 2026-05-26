import { Download, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import TransactionForm from "../components/forms/TransactionForm";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input, Select } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../context/authcontext";
import { formatCurrency, formatDate } from "../lib/format";
import { api } from "../services/api";
import type { Transaction } from "../types/finance";

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Transaction | undefined>();

  const load = async () => {
    setLoading(true);
    const params: Record<string, string | number> = { page_size: 100, ordering: "-date" };
    if (query) params.search = query;
    if (type !== "all") params.type = type;
    setTransactions(await api.transactions.list(params));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const totals = useMemo(() => {
    const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount), 0);
    const expenses = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount), 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setModal("edit");
  };

  const remove = async (transaction: Transaction) => {
    await api.transactions.remove(transaction.id);
    await load();
  };

  const closeModal = () => {
    setModal(null);
    setEditing(undefined);
  };

  return (
    <div>
      <PageHeader
        action={<Button icon={<Plus size={17} />} onClick={() => setModal("create")}>Add transaction</Button>}
        eyebrow="Ledger"
        title="Transactions"
      />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Income", totals.income, "success"],
          ["Expenses", totals.expenses, "danger"],
          ["Net", totals.balance, totals.balance >= 0 ? "success" : "danger"],
        ].map(([label, value, tone]) => (
          <Card className="p-5" key={label}>
            <Badge tone={tone as "success" | "danger"}>{label}</Badge>
            <p className="mt-4 text-3xl font-semibold">{formatCurrency(Number(value), user?.currency)}</p>
          </Card>
        ))}
      </section>

      <Card className="mt-5 p-5">
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
            <Input className="pl-11" placeholder="Search description or category" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <Select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={load}>Filter</Button>
            <a href={api.transactions.exportUrl()}>
              <Button icon={<Download size={17} />} variant="secondary">CSV</Button>
            </a>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-zinc-500">Loading transactions...</p>
        ) : transactions.length ? (
          <div className="overflow-hidden rounded-lg border border-white/10">
            {transactions.map((transaction) => (
              <div className="grid gap-4 border-b border-white/10 bg-black/20 p-4 last:border-b-0 md:grid-cols-[1fr_160px_130px_110px]" key={transaction.id}>
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="mt-1 text-sm text-zinc-500">{transaction.category}</p>
                </div>
                <p className="text-sm text-zinc-400">{formatDate(transaction.date)}</p>
                <p className={transaction.type === "income" ? "font-semibold text-emerald-300" : "font-semibold text-red-300"}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount, user?.currency)}
                </p>
                <div className="flex gap-2 md:justify-end">
                  <button className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-zinc-300" onClick={() => openEdit(transaction)} type="button">
                    <Pencil size={16} />
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-lg bg-red-500/10 text-red-200" onClick={() => remove(transaction)} type="button">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState action={<Button onClick={() => setModal("create")}>Add transaction</Button>} title="No transactions found" text="Try another filter or add a new transaction." />
        )}
      </Card>

      <Modal onClose={closeModal} open={Boolean(modal)} title={modal === "edit" ? "Edit transaction" : "Add transaction"}>
        <TransactionForm initial={editing} onSuccess={() => { closeModal(); load(); }} />
      </Modal>
    </div>
  );
};

export default Transactions;
