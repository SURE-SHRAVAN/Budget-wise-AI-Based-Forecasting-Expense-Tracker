import { Card } from "./Card";

const StatCard = ({ label, value, detail }: { label: string; value: string; detail?: string }) => (
  <Card className="p-5">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    {detail && <p className="mt-2 text-sm text-zinc-400">{detail}</p>}
  </Card>
);

export default StatCard;
