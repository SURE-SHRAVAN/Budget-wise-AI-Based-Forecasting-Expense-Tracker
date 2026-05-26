import { ShieldCheck, UserRound, Wallet } from "lucide-react";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../context/authcontext";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatCurrency } from "../lib/format";

const Profile = () => {
  const { user } = useAuth();
  const { report, transactions, goals } = useDashboardData();

  return (
    <div>
      <PageHeader eyebrow="Account" title="Premium profile" />

      <section className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <Card className="p-6">
          <div className="grid h-24 w-24 place-items-center rounded-lg bg-white text-black">
            <UserRound size={42} />
          </div>
          <h2 className="mt-6 text-3xl font-semibold">{user?.first_name || user?.username}</h2>
          <p className="mt-2 text-zinc-500">{user?.email}</p>
          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-zinc-500">Role</span>
              <span className="capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-zinc-500">Currency</span>
              <span>{user?.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Theme</span>
              <span className="capitalize">{user?.theme}</span>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <Wallet className="text-white" />
            <p className="mt-4 text-sm text-zinc-500">Current balance</p>
            <p className="mt-2 text-3xl font-semibold">{formatCurrency(report?.overview.balance ?? 0, user?.currency)}</p>
          </Card>
          <Card className="p-5">
            <ShieldCheck className="text-emerald-300" />
            <p className="mt-4 text-sm text-zinc-500">Financial score</p>
            <p className="mt-2 text-3xl font-semibold">{report?.overview.financial_health_score ?? 0}</p>
          </Card>
          <Card className="p-5">
            <UserRound className="text-zinc-300" />
            <p className="mt-4 text-sm text-zinc-500">Activity</p>
            <p className="mt-2 text-3xl font-semibold">{transactions.length}</p>
          </Card>
          <Card className="p-5 md:col-span-3">
            <h2 className="text-xl font-semibold">Goal summaries</h2>
            <div className="mt-4 grid gap-3">
              {goals.map((goal) => (
                <div className="rounded-lg border border-white/10 bg-black/30 p-4" key={goal.id}>
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold">{goal.name}</span>
                    <span>{goal.progress_percentage}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-white" style={{ width: `${goal.progress_percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Profile;
