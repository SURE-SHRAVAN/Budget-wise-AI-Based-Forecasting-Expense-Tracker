import { http } from "../lib/http";
import type {
  AnalyticsReport,
  Conversation,
  Goal,
  GoalPayload,
  Message,
  Paginated,
  Transaction,
  TransactionPayload,
  User,
} from "../types/finance";

const unwrapList = <T>(data: Paginated<T> | T[]) => (Array.isArray(data) ? data : data.results);

export const api = {
  auth: {
    register: (payload: { email: string; username: string; password: string }) =>
      http.post<{ user: User; access: string; refresh: string }>("/auth/register/", payload).then((res) => res.data),
    login: (payload: { email: string; password: string }) =>
      http.post<{ user: User; access: string; refresh: string }>("/auth/login/", payload).then((res) => res.data),
    me: () => http.get<User>("/auth/profile/").then((res) => res.data),
    updateProfile: (payload: Partial<User>) => http.patch<User>("/auth/profile/", payload).then((res) => res.data),
    logout: (refresh: string) => http.post("/auth/logout/", { refresh }),
  },
  transactions: {
    list: (params?: Record<string, string | number>) =>
      http.get<Paginated<Transaction> | Transaction[]>("/transactions/", { params }).then((res) => unwrapList(res.data)),
    create: (payload: TransactionPayload) => http.post<Transaction>("/transactions/", payload).then((res) => res.data),
    update: (id: number, payload: Partial<TransactionPayload>) =>
      http.patch<Transaction>(`/transactions/${id}/`, payload).then((res) => res.data),
    remove: (id: number) => http.delete(`/transactions/${id}/`),
    exportUrl: () => `${import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1"}/transactions/export-csv/`,
  },
  goals: {
    list: () => http.get<Paginated<Goal> | Goal[]>("/goals/").then((res) => unwrapList(res.data)),
    create: (payload: GoalPayload) => http.post<Goal>("/goals/", payload).then((res) => res.data),
    update: (id: number, payload: Partial<GoalPayload>) => http.patch<Goal>(`/goals/${id}/`, payload).then((res) => res.data),
    remove: (id: number) => http.delete(`/goals/${id}/`),
  },
  analytics: {
    report: () => http.get<AnalyticsReport>("/analytics/report/").then((res) => res.data),
    insights: () => http.get<{ insights: AnalyticsReport["insights"] }>("/analytics/insights/").then((res) => res.data.insights),
    forecast: () => http.get<AnalyticsReport["forecasts"]>("/analytics/forecast/").then((res) => res.data),
  },
  assistant: {
    conversations: () => http.get<Paginated<Conversation> | Conversation[]>("/assistant/conversations/").then((res) => unwrapList(res.data)),
    chat: (message: string, conversationId?: number) =>
      http
        .post<{ conversation: Conversation; message: Message }>("/assistant/chat/", {
          message,
          conversation_id: conversationId,
        })
        .then((res) => res.data),
  },
};
