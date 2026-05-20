import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
 
const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<"overview" | "goals">("overview");
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
 
  useEffect(() => {
    Promise.all([
      api.auth.profile(),
      api.transactions.list(),
      api.goals.list(),
    ]).then(([u, t, g]) => {
      setUser(u);
      setTransactions(t || []);
      setGoals(g || []);
    });
  }, []);
 
  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
 
  const initials = user ? (user.username?.[0] || user.email?.[0] || "U").toUpperCase() : "U";
 
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
 
  if (!user) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
          body { background:#000; margin:0; }
          .loading-screen { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#000; }
          .loading-dot { width:6px; height:6px; background:rgba(255,255,255,0.4); border-radius:50%; margin:0 3px; animation:ld 1.2s ease-in-out infinite; }
          .loading-dot:nth-child(2) { animation-delay:0.2s; }
          .loading-dot:nth-child(3) { animation-delay:0.4s; }
          @keyframes ld { 0%,80%,100%{transform:scale(0.5);opacity:0.3} 40%{transform:scale(1);opacity:1} }
        `}</style>
        <div className="loading-screen">
          <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
        </div>
      </>
    );
  }
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { background:#000; overflow-x:hidden; min-height:100vh; }
 
        .pr { min-height:100vh; width:100vw; font-family:'DM Sans',sans-serif;
          background:#000; position:relative; overflow:hidden; }
 
        /* Background */
        .orb { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; }
        .orb1 { width:700px; height:700px; background:radial-gradient(circle,rgba(255,255,255,0.09) 0%,transparent 70%);
          top:-200px; left:-200px; animation:pbig 9s ease-in-out infinite; }
        .orb2 { width:550px; height:550px; background:radial-gradient(circle,rgba(160,160,160,0.08) 0%,transparent 70%);
          bottom:-150px; right:-150px; animation:pbig 11s ease-in-out infinite reverse; }
        .orb3 { width:350px; height:350px; background:radial-gradient(circle,rgba(255,255,255,0.05) 0%,transparent 70%);
          top:40%; left:60%; animation:pbig3 7s ease-in-out infinite; }
        @keyframes pbig { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @keyframes pbig3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.2)} }
 
        .grid { position:fixed; inset:0; pointer-events:none; z-index:0;
          background-image:linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);
          background-size:60px 60px; }
 
        .spotlight { position:fixed; width:500px; height:500px; border-radius:50%; z-index:0;
          background:radial-gradient(circle,rgba(255,255,255,0.04) 0%,transparent 70%);
          pointer-events:none; transform:translate(-50%,-50%); transition:left 0.4s ease,top 0.4s ease; }
 
        /* Layout */
        .content { position:relative; z-index:1; max-width:900px; margin:0 auto;
          padding:48px 24px 80px; }
 
        /* Top nav */
        .topnav { display:flex; align-items:center; justify-content:space-between;
          margin-bottom:56px;
          opacity:0; transform:translateY(-8px); transition:all 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s; }
        .topnav.in { opacity:1; transform:translateY(0); }
        .logo { display:flex; align-items:center; gap:10px; }
        .logo-circle { width:26px; height:26px; background:#fff; border-radius:50%;
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .logo-circle::after { content:''; width:11px; height:11px; background:#000; border-radius:50%; }
        .logo-name { font-family:'DM Serif Display',serif; font-size:17px; color:#fff; letter-spacing:0.02em; }
        .logout-btn { font-size:12px; color:rgba(255,255,255,0.3); background:none; border:1px solid rgba(255,255,255,0.1);
          border-radius:2px; padding:8px 16px; cursor:pointer; font-family:'DM Sans',sans-serif;
          letter-spacing:0.05em; transition:all 0.25s; }
        .logout-btn:hover { color:rgba(255,255,255,0.7); border-color:rgba(255,255,255,0.25);
          background:rgba(255,255,255,0.04); }
 
        /* Hero identity block */
        .hero { margin-bottom:48px;
          opacity:0; transform:translateY(16px); transition:all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s; }
        .hero.in { opacity:1; transform:translateY(0); }
        .avatar-row { display:flex; align-items:flex-end; gap:20px; margin-bottom:20px; }
        .avatar { width:72px; height:72px; border-radius:50%;
          background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
          display:flex; align-items:center; justify-content:center;
          font-family:'DM Serif Display',serif; font-size:28px; color:#fff; letter-spacing:-0.02em;
          position:relative; flex-shrink:0; }
        .avatar::after { content:''; position:absolute; inset:-1px; border-radius:50%; padding:1px;
          background:linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 50%,rgba(255,255,255,0.06) 100%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude; }
        .avatar-online { position:absolute; bottom:2px; right:2px; width:12px; height:12px;
          background:#00e676; border-radius:50%; border:2px solid #000; animation:pulse-online 2.5s ease-in-out infinite; }
        @keyframes pulse-online { 0%,100%{box-shadow:0 0 0 0 rgba(0,230,118,0.4)} 50%{box-shadow:0 0 0 6px rgba(0,230,118,0)} }
        .name-block { }
        .name-block h1 { font-family:'DM Serif Display',serif; font-size:42px; color:#fff;
          font-weight:400; line-height:1; letter-spacing:-0.03em; }
        .name-block h1 em { font-style:italic; color:rgba(255,255,255,0.38); }
        .email-line { font-size:13px; color:rgba(255,255,255,0.32); margin-top:6px; font-weight:300; letter-spacing:0.01em; }
 
        /* Stats row */
        .stats-row { display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:36px;
          opacity:0; transform:translateY(16px); transition:all 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s; }
        .stats-row.in { opacity:1; transform:translateY(0); }
 
        .stat-card { position:relative; padding:24px 24px 22px;
          background:rgba(8,8,8,0.8); border:1px solid rgba(255,255,255,0.07);
          border-radius:3px; backdrop-filter:blur(30px);
          box-shadow:0 20px 60px rgba(0,0,0,0.6), 0 0 60px rgba(255,255,255,0.01) inset;
          transition:all 0.35s cubic-bezier(0.16,1,0.3,1); overflow:hidden; }
        .stat-card::before { content:''; position:absolute; inset:0; border-radius:3px; padding:1px;
          background:linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 50%,rgba(255,255,255,0.03) 100%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }
        .stat-card:hover { transform:translateY(-3px); border-color:rgba(255,255,255,0.13);
          box-shadow:0 30px 80px rgba(0,0,0,0.7), 0 0 80px rgba(255,255,255,0.02) inset; }
 
        .stat-label { font-size:10.5px; color:rgba(255,255,255,0.32); letter-spacing:0.1em;
          text-transform:uppercase; font-weight:500; margin-bottom:10px; }
        .stat-value { font-family:'DM Serif Display',serif; font-size:30px; color:#fff;
          letter-spacing:-0.03em; line-height:1; }
        .stat-value.income { color:#00e676; }
        .stat-value.expense { color:#ff5252; }
        .stat-value.balance-pos { color:#fff; }
        .stat-value.balance-neg { color:#ff5252; }
        .stat-sub { font-size:11px; color:rgba(255,255,255,0.2); margin-top:6px; font-weight:300; }
 
        .scan-card { position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);
          animation:scan 8s linear infinite; pointer-events:none; }
        @keyframes scan { 0%{top:-1px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }
 
        /* Tabs */
        .tabs { display:flex; gap:0; margin-bottom:28px; border-bottom:1px solid rgba(255,255,255,0.07);
          opacity:0; transform:translateY(12px); transition:all 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s; }
        .tabs.in { opacity:1; transform:translateY(0); }
        .tab { font-size:12.5px; font-family:'DM Sans',sans-serif; font-weight:400;
          color:rgba(255,255,255,0.3); background:none; border:none; cursor:pointer;
          padding:12px 20px 14px; letter-spacing:0.06em; text-transform:uppercase;
          position:relative; transition:color 0.25s; }
        .tab.active { color:#fff; }
        .tab.active::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px;
          background:#fff; border-radius:1px 1px 0 0; }
        .tab:hover:not(.active) { color:rgba(255,255,255,0.55); }
 
        /* Panel */
        .panel { opacity:0; transform:translateY(12px); transition:all 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s; }
        .panel.in { opacity:1; transform:translateY(0); }
 
        /* Section card */
        .section-card { position:relative; padding:28px 28px;
          background:rgba(8,8,8,0.8); border:1px solid rgba(255,255,255,0.07);
          border-radius:3px; backdrop-filter:blur(30px);
          box-shadow:0 20px 60px rgba(0,0,0,0.5); margin-bottom:16px; }
        .section-card::before { content:''; position:absolute; inset:0; border-radius:3px; padding:1px;
          background:linear-gradient(135deg,rgba(255,255,255,0.09) 0%,transparent 50%,rgba(255,255,255,0.025) 100%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }
 
        .section-title { font-size:10.5px; color:rgba(255,255,255,0.3); letter-spacing:0.1em;
          text-transform:uppercase; font-weight:500; margin-bottom:20px; }
 
        /* User info rows */
        .info-row { display:flex; justify-content:space-between; align-items:center;
          padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
        .info-row:last-child { border-bottom:none; padding-bottom:0; }
        .info-row:first-of-type { padding-top:0; }
        .info-key { font-size:12px; color:rgba(255,255,255,0.3); font-weight:300; letter-spacing:0.01em; }
        .info-val { font-size:13.5px; color:rgba(255,255,255,0.85); font-weight:400; }
 
        /* Transactions list */
        .tx-list { display:flex; flex-direction:column; gap:0; }
        .tx-item { display:flex; align-items:center; justify-content:space-between;
          padding:13px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
        .tx-item:last-child { border-bottom:none; }
        .tx-left { display:flex; align-items:center; gap:12px; }
        .tx-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
        .tx-dot.income { background:#00e676; box-shadow:0 0 8px rgba(0,230,118,0.5); }
        .tx-dot.expense { background:#ff5252; box-shadow:0 0 8px rgba(255,82,82,0.5); }
        .tx-desc { font-size:13.5px; color:rgba(255,255,255,0.75); }
        .tx-date { font-size:11px; color:rgba(255,255,255,0.25); margin-top:2px; }
        .tx-amount { font-family:'DM Serif Display',serif; font-size:16px; letter-spacing:-0.02em; }
        .tx-amount.income { color:#00e676; }
        .tx-amount.expense { color:#ff5252; }
 
        .empty-state { text-align:center; padding:32px 0;
          font-size:13px; color:rgba(255,255,255,0.2); font-weight:300; letter-spacing:0.02em; }
 
        /* Goals */
        .goal-item { margin-bottom:20px; }
        .goal-item:last-child { margin-bottom:0; }
        .goal-header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; }
        .goal-name { font-size:13.5px; color:rgba(255,255,255,0.8); }
        .goal-amounts { font-size:11.5px; color:rgba(255,255,255,0.3); font-weight:300; }
        .goal-amounts span { color:rgba(255,255,255,0.6); }
        .goal-bar { height:3px; background:rgba(255,255,255,0.07); border-radius:3px; overflow:hidden; }
        .goal-bar-fill { height:100%; background:#fff; border-radius:3px;
          transition:width 1.2s cubic-bezier(0.16,1,0.3,1); }
        .goal-pct { font-size:10px; color:rgba(255,255,255,0.25); margin-top:5px;
          letter-spacing:0.06em; }
      `}</style>
 
      <div className="pr" ref={containerRef}>
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
              <span className="logo-name">BudgetWise_Analysis</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Sign out</button>
          </nav>
 
          {/* Hero */}
          <div className={`hero ${mounted ? "in" : ""}`}>
            <div className="avatar-row">
              <div className="avatar">
                {initials}
                <div className="avatar-online" />
              </div>
              <div className="name-block">
                <h1>{user.username || "User"} <em>profile.</em></h1>
                <div className="email-line">{user.email}</div>
              </div>
            </div>
          </div>
 
          {/* Stats */}
          <div className={`stats-row ${mounted ? "in" : ""}`}>
            <div className="stat-card">
              <div className="scan-card" />
              <div className="stat-label">Total Income</div>
              <div className="stat-value income">₹{totalIncome.toLocaleString("en-IN")}</div>
              <div className="stat-sub">{transactions.filter(t => t.type === "income").length} transactions</div>
            </div>
            <div className="stat-card">
              <div className="scan-card" style={{ animationDelay: "2.5s" }} />
              <div className="stat-label">Total Expenses</div>
              <div className="stat-value expense">₹{totalExpense.toLocaleString("en-IN")}</div>
              <div className="stat-sub">{transactions.filter(t => t.type === "expense").length} transactions</div>
            </div>
            <div className="stat-card">
              <div className="scan-card" style={{ animationDelay: "5s" }} />
              <div className="stat-label">Net Balance</div>
              <div className={`stat-value ${balance >= 0 ? "balance-pos" : "balance-neg"}`}>
                {balance < 0 ? "−" : ""}₹{Math.abs(balance).toLocaleString("en-IN")}
              </div>
              <div className="stat-sub">{balance >= 0 ? "Surplus" : "Deficit"}</div>
            </div>
          </div>
 
          {/* Tabs */}
          <div className={`tabs ${mounted ? "in" : ""}`}>
            <button className={`tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
            <button className={`tab ${activeTab === "goals" ? "active" : ""}`} onClick={() => setActiveTab("goals")}>Goals</button>
          </div>
 
          <div className={`panel ${mounted ? "in" : ""}`}>
            {activeTab === "overview" && (
              <>
                {/* Account info */}
                <div className="section-card">
                  <div className="section-title">Account Details</div>
                  <div className="info-row">
                    <span className="info-key">Username</span>
                    <span className="info-val">{user.username}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">Email</span>
                    <span className="info-val">{user.email}</span>
                  </div>
                  {user.date_joined && (
                    <div className="info-row">
                      <span className="info-key">Member since</span>
                      <span className="info-val">{new Date(user.date_joined).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                  )}
                </div>
 
                {/* Recent transactions */}
                <div className="section-card">
                  <div className="section-title">Recent Transactions</div>
                  {transactions.length === 0 ? (
                    <div className="empty-state">No transactions yet</div>
                  ) : (
                    <div className="tx-list">
                      {transactions.slice(0, 6).map(t => (
                        <div className="tx-item" key={t.id}>
                          <div className="tx-left">
                            <div className={`tx-dot ${t.type}`} />
                            <div>
                              <div className="tx-desc">{t.description}</div>
                              <div className="tx-date">{new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                            </div>
                          </div>
                          <div className={`tx-amount ${t.type}`}>
                            {t.type === "expense" ? "−" : "+"}₹{t.amount.toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
 
            {activeTab === "goals" && (
              <div className="section-card">
                <div className="section-title">Financial Goals</div>
                {goals.length === 0 ? (
                  <div className="empty-state">No goals added yet</div>
                ) : (
                  goals.map(g => {
                    const pct = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100));
                    return (
                      <div className="goal-item" key={g.id}>
                        <div className="goal-header">
                          <span className="goal-name">{g.name}</span>
                          <span className="goal-amounts">
                            <span>₹{g.current_amount.toLocaleString("en-IN")}</span>
                            {" "}/ ₹{g.target_amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="goal-bar">
                          <div className="goal-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="goal-pct">{pct}% complete</div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
 
export default Profile;