import { Bot, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { api } from "../services/api";
import type { Conversation, Message } from "../types/finance";

const starters = [
  "Where am I overspending?",
  "Can I afford a new laptop?",
  "How much did I spend on food?",
  "Predict my savings in 6 months.",
];

const Assistant = () => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (message: string) => {
    if (!message.trim()) return;
    const optimistic: Message = {
      id: Date.now(),
      role: "user",
      content: message,
      created_at: new Date().toISOString(),
    };
    setMessages((current) => [...current, optimistic]);
    setInput("");
    setLoading(true);
    try {
      const response = await api.assistant.chat(message, conversation?.id);
      setConversation(response.conversation);
      setMessages(response.conversation.messages);
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(input);
  };

  return (
    <div>
      <PageHeader eyebrow="AI copilot" title="Ask your money better questions" />

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card className="flex min-h-[680px] flex-col p-5">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-white shadow-sm">
              <Bot size={21} />
            </div>
            <div>
              <h2 className="font-semibold text-ink">BudgetWise Copilot</h2>
              <p className="text-sm text-graphite">Context-aware financial Q&A</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-5">
            {messages.length ? (
              <div className="grid gap-4">
                {messages.map((message) => (
                  <div className={`max-w-[86%] rounded-xl p-4 shadow-sm ${message.role === "user" ? "ml-auto bg-accent text-white" : "bg-white border border-line text-ink"}`} key={message.id}>
                    <p className="text-sm leading-6">{message.content}</p>
                  </div>
                ))}
                {loading && <div className="w-fit rounded-xl border border-line bg-white p-4 text-sm text-graphite shadow-sm">Analyzing your financial context...</div>}
                <div ref={bottomRef} />
              </div>
            ) : (
              <EmptyState title="No conversation yet" text="Ask about overspending, affordability, category totals, savings projections, or goals." />
            )}
          </div>

          <form className="flex gap-3 border-t border-white/10 pt-4" onSubmit={submit}>
            <Input placeholder="Ask a financial question..." value={input} onChange={(event) => setInput(event.target.value)} />
            <Button disabled={loading} icon={<Send size={17} />} type="submit">
              Send
            </Button>
          </form>
        </Card>

        <aside className="grid gap-4 content-start">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-ink">
              <Sparkles size={18} className="text-accent" />
              <h2 className="font-semibold">Prompt starters</h2>
            </div>
            <div className="mt-4 grid gap-2">
              {starters.map((starter) => (
                <button className="rounded-lg border border-line bg-secondary p-3 text-left text-sm text-graphite transition hover:bg-white hover:shadow-sm" key={starter} onClick={() => send(starter)} type="button">
                  {starter}
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold text-ink">How it works</h2>
            <p className="mt-3 text-sm leading-6 text-graphite">
              The backend injects your aggregated financial context, recent insights, trends, and goals into a compact prompt. If no OpenAI key is configured, a deterministic local insight engine answers common questions.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Assistant;
