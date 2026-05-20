import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/forms/TransactionForm";
import GoalForm from "../components/forms/GoalForm";
import { api } from "../lib/api";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
};

type Goal = {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
};

const Finance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<"transactions" | "goals">("transactions");
  const [showTxForm, setShowTxForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsData, goalsData] = await Promise.all([
        api.transactions.list(),
        api.goals.list(),
      ]);
      setTransactions(transactionsData || []);
      setGoals(goalsData || []);
    } catch (error: any) {
      console.error("Fetch Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTransactionAdded = () => { fetchData(); setShowTxForm(false); };
  const handleGoalAdded = () => { fetchData(); setShowGoalForm(false); };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
          body { background:#000; margin:0; }
          .ls { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#000; }
          .ld { width:6px; height:6px; background:rgba(255,255,255,0.4); border-radius:50%; margin:0 3px; animation:ld 1.2s ease-in-out infinite; }
          .ld:nth-child(2){animation-delay:.2s}.ld:nth-child(3){animation-delay:.4s}
          @keyframes ld{0%,80%,100%{transform:scale(.5);opacity:.3}40%{transform:scale(1);opacity:1}}
        `}</style>
        <div className="ls"><div className="ld"/><div className="ld"/><div className="ld"/></div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { background:#000; overflow-x:hidden; min-height:100vh; }

        .fi { min-height:100vh; width:100vw; font-family:'DM Sans',sans-serif;
          background:#000; position:relative; overflow:hidden; }

        /* Background */
        .orb { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; }
        .orb1 { width:700px; height:700px; background:radial-gradient(circle,rgba(255,255,255,0.09) 0%,transparent 70%);
          top:-200px; left:-200px; animation:pbig 9s ease-in-out infinite; }
        .orb2 { width:550px; height:550px; background:radial-gradient(circle,rgba(160,160,160,0.08) 0%,transparent 70%);
          bottom:-150px; right:-150px; animation:pbig 11s ease-in-out infinite reverse; }
        .orb3 { width:380px; height:380px; background:radial-gradient(circle,rgba(255,255,255,0.045) 0%,transparent 70%);
          top:35%; left:55%; animation:pbig3 8s ease-in-out infinite; }
        @keyframes pbig { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @keyframes pbig3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.2)} }

        .grid { position:fixed; inset:0; pointer-events:none; z-index:0;
          background-image:linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);
          background-size:60px 60px; }

        .spotlight { position:fixed; width:500px; height:500px; border-radius:50%; z-index:0;
          background:radial-gradient(circle,rgba(255,255,255,0.04) 0%,transparent 70%);
          pointer-events:none; transform:translate(-50%,-50%); transition:left 0.4s ease,top 0.4s ease; }

        /* Content */
        .content { position:relative; z-index:1; max-width:960px; margin:0 auto;
          padding:48px 24px 80px; }

        /* Nav */
        .topnav { display:flex; align-items:center; justify-content:space-between;
          margin-bottom:56px;
          opacity:0; transform:translateY(-8px); transition:all 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s; }
        .topnav.in { opacity:1; transform:translateY(0); }
        .logo { display:flex; align-items:center; gap:10px; }
        .logo-circle { width:26px; height:26px; background:#fff; border-radius:50%;
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .logo-circle::after { content:''; width:11px; height:11px; background:#000; border-radius:50%; }
        .logo-name { font-family:'DM Serif Display',serif; font-size:17px; color:#fff; letter-spacing:0.02em; }
        .nav-links { display:flex; gap:8px; align-items:center; }
        .nav-link { font-size:12px; color:rgba(255,255,255,0.3); background:none;
          border:1px solid rgba(255,255,255,0.1); border-radius:2px; padding:8px 16px;
          cursor:pointer; font-family:'DM Sans',sans-serif; letter-spacing:0.05em; transition:all 0.25s; }
        .nav-link:hover { color:rgba(255,255,255,0.7); border-color:rgba(255,255,255,0.25);
          background:rgba(255,255,255,0.04); }

        /* Page title */
        .page-head { margin-bottom:40px;
          opacity:0; transform:translateY(16px); transition:all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s; }
        .page-head.in { opacity:1; transform:translateY(0); }
        .page-head h1 { font-family:'DM Serif Display',serif; font-size:48px; color:#fff;
          font-weight:400; letter-spacing:-0.03em; line-height:1; }
        .page-head h1 em { font-style:italic; color:rgba(255,255,255,0.35); }
        .page-sub { font-size:13px; color:rgba(255,255,255,0.28); margin-top:8px;
          font-weight:300; letter-spacing:0.01em; }

        /* Stats row */
        .stats-row { display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-bottom:36px;
          opacity:0; transform:translateY(16px); transition:all 0.8s cubic-bezier(0.16,1,0.3,1) 0.32s; }
        .stats-row.in { opacity:1; transform:translateY(0); }

        .stat-card { position:relative; padding:24px 22px 20px;
          background:rgba(8,8,8,0.8); border:1px solid rgba(255,255,255,0.07);
          border-radius:3px; backdrop-filter:blur(30px);
          box-shadow:0 20px 60px rgba(0,0,0,0.6);
          transition:all 0.35s cubic-bezier(0.16,1,0.3,1); overflow:hidden; }
        .stat-card::before { content:''; position:absolute; inset:0; border-radius:3px; padding:1px;
          background:linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 50%,rgba(255,255,255,0.03) 100%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }
        .stat-card:hover { transform:translateY(-3px);
          box-shadow:0 30px 80px rgba(0,0,0,0.7); border-color:rgba(255,255,255,0.12); }

        .scan-line { position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);
          animation:scan 8s linear infinite; pointer-events:none; }
        @keyframes scan { 0%{top:-1px;opacity:0}5%{opacity:1}95%{opacity:1}100%{top:100%;opacity:0} }

        .stat-label { font-size:10px; color:rgba(255,255,255,0.3); letter-spacing:0.1em;
          text-transform:uppercase; font-weight:500; margin-bottom:10px; }
        .stat-value { font-family:'DM Serif Display',serif; font-size:26px; color:#fff;
          letter-spacing:-0.03em; line-height:1; }
        .stat-value.income { color:#00e676; }
        .stat-value.expense { color:#ff5252; }
        .stat-value.neg { color:#ff5252; }
        .stat-sub { font-size:10.5px; color:rgba(255,255,255,0.2); margin-top:5px; font-weight:300; }

        /* Tabs + add button row */
        .tab-row { display:flex; align-items:center; justify-content:space-between;
          border-bottom:1px solid rgba(255,255,255,0.07); margin-bottom:24px;
          opacity:0; transform:translateY(12px); transition:all 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s; }
        .tab-row.in { opacity:1; transform:translateY(0); }
        .tabs { display:flex; gap:0; }
        .tab { font-size:12px; font-family:'DM Sans',sans-serif; font-weight:400;
          color:rgba(255,255,255,0.3); background:none; border:none; cursor:pointer;
          padding:12px 20px 14px; letter-spacing:0.07em; text-transform:uppercase;
          position:relative; transition:color 0.25s; }
        .tab.active { color:#fff; }
        .tab.active::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px;
          background:#fff; border-radius:1px 1px 0 0; }
        .tab:hover:not(.active) { color:rgba(255,255,255,0.55); }

        .add-btn { font-size:11.5px; font-family:'DM Sans',sans-serif; font-weight:500;
          letter-spacing:0.07em; text-transform:uppercase;
          background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1);
          color:rgba(255,255,255,0.7); border-radius:2px; padding:8px 18px;
          cursor:pointer; transition:all 0.28s cubic-bezier(0.16,1,0.3,1); position:relative; overflow:hidden; }
        .add-btn::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);
          transition:left 0.5s cubic-bezier(0.16,1,0.3,1); }
        .add-btn:hover::before { left:100%; }
        .add-btn:hover { background:rgba(255,255,255,0.12); border-color:rgba(255,255,255,0.2);
          color:#fff; transform:translateY(-1px); }

        /* Panel */
        .panel { opacity:0; transform:translateY(10px);
          transition:all 0.6s cubic-bezier(0.16,1,0.3,1) 0.55s; }
        .panel.in { opacity:1; transform:translateY(0); }

        /* Form modal overlay */
        .form-overlay { position:fixed; inset:0; z-index:100;
          background:rgba(0,0,0,0.75); backdrop-filter:blur(12px);
          display:flex; align-items:center; justify-content:center;
          opacity:0; pointer-events:none; transition:opacity 0.3s; }
        .form-overlay.show { opacity:1; pointer-events:all; }
        .form-modal { position:relative; width:100%; max-width:440px; margin:24px;
          background:rgba(6,6,6,0.95); border:1px solid rgba(255,255,255,0.1);
          border-radius:3px; backdrop-filter:blur(40px);
          box-shadow:0 0 0 1px rgba(255,255,255,0.03),0 60px 120px rgba(0,0,0,0.95);
          padding:36px 36px 32px;
          transform:scale(0.96) translateY(12px); transition:transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .form-overlay.show .form-modal { transform:scale(1) translateY(0); }
        .form-modal::before { content:''; position:absolute; inset:0; border-radius:3px; padding:1px;
          background:linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 50%,rgba(255,255,255,0.04) 100%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }
        .modal-close { position:absolute; top:16px; right:16px; width:30px; height:30px;
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
          border-radius:2px; cursor:pointer; display:flex; align-items:center; justify-content:center;
          color:rgba(255,255,255,0.4); font-size:16px; transition:all 0.2s; }
        .modal-close:hover { background:rgba(255,255,255,0.1); color:#fff; }
        .modal-title { font-family:'DM Serif Display',serif; font-size:26px; color:#fff;
          font-weight:400; letter-spacing:-0.02em; margin-bottom:6px; }
        .modal-sub { font-size:12px; color:rgba(255,255,255,0.3); font-weight:300;
          letter-spacing:0.01em; margin-bottom:28px; }

        /* Section card */
        .section-card { position:relative;
          background:rgba(8,8,8,0.8); border:1px solid rgba(255,255,255,0.07);
          border-radius:3px; backdrop-filter:blur(30px);
          box-shadow:0 20px 60px rgba(0,0,0,0.5); overflow:hidden; }
        .section-card::before { content:''; position:absolute; inset:0; border-radius:3px; padding:1px;
          background:linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 50%,rgba(255,255,255,0.025) 100%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }

        /* Transaction rows */
        .tx-item { display:flex; align-items:center; justify-content:space-between;
          padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.04);
          transition:background 0.2s; }
        .tx-item:last-child { border-bottom:none; }
        .tx-item:hover { background:rgba(255,255,255,0.02); }
        .tx-left { display:flex; align-items:center; gap:14px; }
        .tx-icon { width:34px; height:34px; border-radius:50%; flex-shrink:0;
          display:flex; align-items:center; justify-content:center; font-size:13px; }
        .tx-icon.income { background:rgba(0,230,118,0.08); border:1px solid rgba(0,230,118,0.15); color:#00e676; }
        .tx-icon.expense { background:rgba(255,82,82,0.08); border:1px solid rgba(255,82,82,0.15); color:#ff5252; }
        .tx-desc { font-size:13.5px; color:rgba(255,255,255,0.75); }
        .tx-date { font-size:11px; color:rgba(255,255,255,0.22); margin-top:2px; }
        .tx-right { text-align:right; }
        .tx-amount { font-family:'DM Serif Display',serif; font-size:17px; letter-spacing:-0.02em; }
        .tx-amount.income { color:#00e676; }
        .tx-amount.expense { color:#ff5252; }
        .tx-type { font-size:10px; color:rgba(255,255,255,0.2); letter-spacing:0.06em;
          text-transform:uppercase; margin-top:2px; }

        /* Goal items */
        .goal-item { padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.04); }
        .goal-item:last-child { border-bottom:none; }
        .goal-header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px; }
        .goal-name { font-size:14px; color:rgba(255,255,255,0.8); }
        .goal-amounts { font-size:12px; color:rgba(255,255,255,0.28); font-weight:300; }
        .goal-amounts strong { color:rgba(255,255,255,0.7); font-weight:400; }
        .goal-bar { height:2px; background:rgba(255,255,255,0.07); border-radius:2px; overflow:hidden; }
        .goal-bar-fill { height:100%; background:linear-gradient(90deg,rgba(255,255,255,0.5),#fff);
          border-radius:2px; transition:width 1.4s cubic-bezier(0.16,1,0.3,1); }
        .goal-footer { display:flex; justify-content:space-between; margin-top:7px; }
        .goal-pct { font-size:10.5px; color:rgba(255,255,255,0.25); letter-spacing:0.04em; }
        .goal-remaining { font-size:10.5px; color:rgba(255,255,255,0.2); font-weight:300; }

        .empty-state { padding:48px 24px; text-align:center;
          font-size:13px; color:rgba(255,255,255,0.2); font-weight:300; letter-spacing:0.02em; }
        .empty-state span { display:block; font-family:'DM Serif Display',serif; font-size:32px;
          color:rgba(255,255,255,0.06); margin-bottom:12px; }

        /* Corner accents on section card */
        .ca { position:absolute; width:10px; height:10px; opacity:0.2; }
        .ca.tl { top:0; left:0; border-top:1px solid #fff; border-left:1px solid #fff; }
        .ca.tr { top:0; right:0; border-top:1px solid #fff; border-right:1px solid #fff; }
        .ca.bl { bottom:0; left:0; border-bottom:1px solid #fff; border-left:1px solid #fff; }
        .ca.br { bottom:0; right:0; border-bottom:1px solid #fff; border-right:1px solid #fff; }
      `}</style>

      <div className="fi" ref={containerRef}>
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="grid" />
        <div className="spotlight" style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }} />

        <div className="content">
          {/* Nav */}
          <nav className={`topnav ${mounted ? "in" : ""}`}>
            <div className="logo">
              <div className="logo-circle" />
              <span className="logo-name">Studio</span>
            </div>
            <div className="nav-links">
              <button className="nav-link" onClick={() => navigate("/profile")}>Profile</button>
            </div>
          </nav>

          {/* Page title */}
          <div className={`page-head ${mounted ? "in" : ""}`}>
            <h1>Financial <em>overview.</em></h1>
            <p className="page-sub">Track income, expenses, and your savings goals</p>
          </div>

          {/* Stats */}
          <div className={`stats-row ${mounted ? "in" : ""}`}>
            {[
              { label: "Total Income", value: `₹${totalIncome.toLocaleString("en-IN")}`, cls: "income", sub: `${transactions.filter(t => t.type === "income").length} entries`, delay: "0s" },
              { label: "Total Expenses", value: `₹${totalExpense.toLocaleString("en-IN")}`, cls: "expense", sub: `${transactions.filter(t => t.type === "expense").length} entries`, delay: "2s" },
              { label: "Net Balance", value: `${balance < 0 ? "−" : ""}₹${Math.abs(balance).toLocaleString("en-IN")}`, cls: balance < 0 ? "neg" : "", sub: balance >= 0 ? "Surplus" : "Deficit", delay: "4s" },
              { label: "Savings Rate", value: `${savingsRate}%`, cls: savingsRate < 0 ? "neg" : "", sub: "of income saved", delay: "6s" },
            ].map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="scan-line" style={{ animationDelay: s.delay }} />
                <div className="stat-label">{s.label}</div>
                <div className={`stat-value ${s.cls}`}>{s.value}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs row */}
          <div className={`tab-row ${mounted ? "in" : ""}`}>
            <div className="tabs">
              <button className={`tab ${activeTab === "transactions" ? "active" : ""}`} onClick={() => setActiveTab("transactions")}>Transactions</button>
              <button className={`tab ${activeTab === "goals" ? "active" : ""}`} onClick={() => setActiveTab("goals")}>Goals</button>
            </div>
            <button className="add-btn" onClick={() => {
              if (activeTab === "transactions") setShowTxForm(true);
              else setShowGoalForm(true);
            }}>
              + Add {activeTab === "transactions" ? "Transaction" : "Goal"}
            </button>
          </div>

          {/* Panel */}
          <div className={`panel ${mounted ? "in" : ""}`}>
            {activeTab === "transactions" && (
              <div className="section-card">
                <div className="ca tl" /><div className="ca tr" />
                <div className="ca bl" /><div className="ca br" />
                {transactions.length === 0 ? (
                  <div className="empty-state">
                    <span>₹</span>No transactions yet
                  </div>
                ) : (
                  transactions.map(t => (
                    <div className="tx-item" key={t.id}>
                      <div className="tx-left">
                        <div className={`tx-icon ${t.type}`}>
                          {t.type === "income" ? "↑" : "↓"}
                        </div>
                        <div>
                          <div className="tx-desc">{t.description}</div>
                          <div className="tx-date">
                            {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                      <div className="tx-right">
                        <div className={`tx-amount ${t.type}`}>
                          {t.type === "expense" ? "−" : "+"}₹{t.amount.toLocaleString("en-IN")}
                        </div>
                        <div className="tx-type">{t.type}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "goals" && (
              <div className="section-card">
                <div className="ca tl" /><div className="ca tr" />
                <div className="ca bl" /><div className="ca br" />
                {goals.length === 0 ? (
                  <div className="empty-state">
                    <span>◎</span>No goals added yet
                  </div>
                ) : (
                  goals.map(g => {
                    const pct = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100));
                    const remaining = g.target_amount - g.current_amount;
                    return (
                      <div className="goal-item" key={g.id}>
                        <div className="goal-header">
                          <span className="goal-name">{g.name}</span>
                          <span className="goal-amounts">
                            <strong>₹{g.current_amount.toLocaleString("en-IN")}</strong>
                            {" "}/ ₹{g.target_amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="goal-bar">
                          <div className="goal-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="goal-footer">
                          <span className="goal-pct">{pct}% complete</span>
                          {remaining > 0 && (
                            <span className="goal-remaining">₹{remaining.toLocaleString("en-IN")} to go</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Transaction Form Modal */}
        <div className={`form-overlay ${showTxForm ? "show" : ""}`} onClick={e => { if (e.target === e.currentTarget) setShowTxForm(false); }}>
          <div className="form-modal">
            <button className="modal-close" onClick={() => setShowTxForm(false)}>×</button>
            <div className="modal-title">Add transaction.</div>
            <div className="modal-sub">Record a new income or expense entry</div>
            <TransactionForm onSuccess={handleTransactionAdded} />
          </div>
        </div>

        {/* Goal Form Modal */}
        <div className={`form-overlay ${showGoalForm ? "show" : ""}`} onClick={e => { if (e.target === e.currentTarget) setShowGoalForm(false); }}>
          <div className="form-modal">
            <button className="modal-close" onClick={() => setShowGoalForm(false)}>×</button>
            <div className="modal-title">New goal.</div>
            <div className="modal-sub">Set a financial target to work towards</div>
            <GoalForm onSuccess={handleGoalAdded} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Finance;