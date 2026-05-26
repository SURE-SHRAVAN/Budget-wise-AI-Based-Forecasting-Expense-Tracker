import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import type { AnalyticsReport, Goal, Transaction } from "../types/finance";

type DashboardState = {
  report: AnalyticsReport | null;
  transactions: Transaction[];
  goals: Goal[];
};

const initialState: DashboardState = {
  report: null,
  transactions: [],
  goals: [],
};

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardState>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [report, transactions, goals] = await Promise.all([
        api.analytics.report(),
        api.transactions.list({ page_size: 50 }),
        api.goals.list(),
      ]);
      setData({ report, transactions, goals });
    } catch {
      setError("Unable to load your financial intelligence workspace.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, error, loading, reload: load };
};
