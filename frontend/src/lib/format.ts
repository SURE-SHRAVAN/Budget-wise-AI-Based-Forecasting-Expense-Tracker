export const formatCurrency = (value: number | string, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

export const percentageTone = (value: number) => {
  if (value >= 70) return "text-emerald-300";
  if (value >= 35) return "text-zinc-100";
  return "text-amber-300";
};
