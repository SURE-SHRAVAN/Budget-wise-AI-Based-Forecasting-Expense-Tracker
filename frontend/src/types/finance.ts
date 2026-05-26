export type User = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: "user" | "admin";
  currency: string;
  theme: "system" | "light" | "dark";
  notifications_enabled: boolean;
  created_at: string;
};

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: number;
  amount: string;
  description: string;
  category: string;
  type: TransactionType;
  date: string;
  created_at: string;
  updated_at: string;
};

export type TransactionPayload = {
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  date: string;
};

export type Goal = {
  id: number;
  name: string;
  target_amount: string;
  current_amount: string;
  deadline: string;
  progress_percentage: number;
  remaining_amount: string;
  days_remaining: number;
  created_at: string;
  updated_at: string;
};

export type GoalPayload = {
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
};

export type Insight = {
  type: string;
  severity: "success" | "info" | "warning" | "danger";
  title: string;
  detail: string;
};

export type AnalyticsReport = {
  overview: {
    income: number;
    expenses: number;
    balance: number;
    savings_rate: number;
    goal_progress: number;
    financial_health_score: number;
    transaction_count: number;
    goal_count: number;
  };
  monthly_trends: Array<{
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }>;
  category_breakdown: Array<{
    category: string;
    value: number;
  }>;
  expense_heatmap: Array<{
    day: string;
    value: number;
  }>;
  forecasts: {
    average_income: number;
    average_expenses: number;
    monthly_savings_prediction: number;
    six_month_savings_projection: number;
    anomalies: Array<{
      id: number;
      description: string;
      amount: number;
      category: string;
      date: string;
    }>;
  };
  insights: Insight[];
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Message = {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

export type Conversation = {
  id: number;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
};
