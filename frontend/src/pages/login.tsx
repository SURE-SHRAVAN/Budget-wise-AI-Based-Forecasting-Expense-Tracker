import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", { email, password });
      sessionStorage.setItem("access", res.data.access);
      sessionStorage.setItem("refresh", res.data.refresh);
      const profile = await axios.get("http://127.0.0.1:8000/api/auth/profile/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });
      sessionStorage.setItem("user", JSON.stringify(profile.data));
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; overflow: hidden; }

        .lr { min-height:100vh; width:100vw; display:flex; align-items:center; justify-content:center;
          font-family:'DM Sans',sans-serif; background:#000; position:relative; overflow:hidden; }

        .orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }
        .orb1 { width:650px; height:650px; background:radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 70%);
          top:-200px; left:-200px; animation:pbig 9s ease-in-out infinite; }
        .orb2 { width:500px; height:500px; background:radial-gradient(circle,rgba(160,160,160,0.1) 0%,transparent 70%);
          bottom:-150px; right:-150px; animation:pbig 11s ease-in-out infinite reverse; }
        .orb3 { width:350px; height:350px; background:radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 70%);
          top:50%; left:50%; transform:translate(-50%,-50%); animation:pbig 7s ease-in-out infinite; }
        @keyframes pbig { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        .orb3 { animation:pbig3 7s ease-in-out infinite; }
        @keyframes pbig3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.2)} }

        .grid { position:absolute; inset:0; pointer-events:none;
          background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
          background-size:60px 60px; }

        .spotlight { position:absolute; width:500px; height:500px; border-radius:50%;
          background:radial-gradient(circle,rgba(255,255,255,0.045) 0%,transparent 70%);
          pointer-events:none; transform:translate(-50%,-50%); transition:left 0.4s ease,top 0.4s ease; }

        .card {
          position:relative; width:420px; padding:56px 48px;
          background:rgba(8,8,8,0.85); border:1px solid rgba(255,255,255,0.07);
          border-radius:3px; backdrop-filter:blur(40px); -webkit-backdrop-filter:blur(40px);
          box-shadow:0 0 0 1px rgba(255,255,255,0.03),0 50px 100px rgba(0,0,0,0.9),0 0 80px rgba(255,255,255,0.02) inset;
          transform:translateY(28px); opacity:0; transition:all 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .card.in { transform:translateY(0); opacity:1; }
        .card::before { content:''; position:absolute; inset:0; border-radius:3px; padding:1px;
          background:linear-gradient(135deg,rgba(255,255,255,0.14) 0%,transparent 45%,rgba(255,255,255,0.04) 100%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }

        .scan { position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
          animation:scan 7s linear infinite; pointer-events:none; }
        @keyframes scan { 0%{top:-1px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }

        .c { position:absolute; width:14px; height:14px; opacity:0.25; }
        .ctla { top:-1px; left:-1px; border-top:1px solid #fff; border-left:1px solid #fff; }
        .ctra { top:-1px; right:-1px; border-top:1px solid #fff; border-right:1px solid #fff; }
        .cbla { bottom:-1px; left:-1px; border-bottom:1px solid #fff; border-left:1px solid #fff; }
        .cbra { bottom:-1px; right:-1px; border-bottom:1px solid #fff; border-right:1px solid #fff; }

        .logo { display:flex; align-items:center; gap:10px; margin-bottom:48px;
          opacity:0; transform:translateY(8px); transition:all 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s; }
        .logo.in { opacity:1; transform:translateY(0); }
        .logo-circle { width:26px; height:26px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .logo-circle::after { content:''; width:11px; height:11px; background:#000; border-radius:50%; }
        .logo-name { font-family:'DM Serif Display',serif; font-size:17px; color:#fff; letter-spacing:0.02em; }

        .hdg { opacity:0; transform:translateY(8px); transition:all 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s; }
        .hdg.in { opacity:1; transform:translateY(0); }
        .hdg h1 { font-family:'DM Serif Display',serif; font-size:38px; color:#fff; font-weight:400;
          line-height:1.1; letter-spacing:-0.025em; }
        .hdg h1 em { font-style:italic; color:rgba(255,255,255,0.42); }
        .sub { font-size:12.5px; color:rgba(255,255,255,0.3); margin:6px 0 40px; font-weight:300; letter-spacing:0.015em; }

        .form { display:flex; flex-direction:column; gap:14px;
          opacity:0; transform:translateY(8px); transition:all 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s; }
        .form.in { opacity:1; transform:translateY(0); }

        .ig { position:relative; }
        .lbl { position:absolute; top:50%; left:16px; transform:translateY(-50%); font-size:13px;
          color:rgba(255,255,255,0.28); pointer-events:none; transition:all 0.25s cubic-bezier(0.16,1,0.3,1);
          font-weight:300; letter-spacing:0.01em; }
        .ig.act .lbl, .ig.val .lbl { top:14px; font-size:10px; color:rgba(255,255,255,0.38);
          letter-spacing:0.09em; text-transform:uppercase; }

        .inp { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
          color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:400;
          padding:28px 16px 12px; border-radius:2px; outline:none; caret-color:#fff;
          transition:all 0.28s cubic-bezier(0.16,1,0.3,1); }
        .inp::placeholder { color:transparent; }
        .inp:hover { border-color:rgba(255,255,255,0.13); background:rgba(255,255,255,0.055); }
        .inp:focus { border-color:rgba(255,255,255,0.32); background:rgba(255,255,255,0.07);
          box-shadow:0 0 0 3px rgba(255,255,255,0.04); }

        .iline { position:absolute; bottom:0; left:50%; height:1px; width:0; background:#fff;
          transition:width 0.4s cubic-bezier(0.16,1,0.3,1),left 0.4s cubic-bezier(0.16,1,0.3,1); border-radius:0 0 2px 2px; }
        .ig.act .iline { width:100%; left:0; }

        .err { display:flex; align-items:center; gap:8px; padding:12px 14px;
          background:rgba(255,70,70,0.07); border:1px solid rgba(255,70,70,0.18); border-radius:2px;
          font-size:12px; color:rgba(255,120,120,0.9); letter-spacing:0.01em;
          animation:shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97); }
        .errdot { width:5px; height:5px; background:rgba(255,90,90,0.8); border-radius:50%; flex-shrink:0; animation:blink 1.5s infinite; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .btn { position:relative; width:100%; padding:16px 24px; margin-top:6px;
          background:#fff; color:#000; border:none; border-radius:2px;
          font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500;
          letter-spacing:0.05em; cursor:pointer; overflow:hidden;
          transition:all 0.28s cubic-bezier(0.16,1,0.3,1); }
        .btn::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent);
          transition:left 0.55s cubic-bezier(0.16,1,0.3,1); }
        .btn:hover::before { left:100%; }
        .btn:hover { background:#e6e6e6; transform:translateY(-1px); box-shadow:0 10px 35px rgba(255,255,255,0.14); }
        .btn:active { transform:translateY(0); box-shadow:none; }
        .btn:disabled { background:rgba(255,255,255,0.18); color:rgba(0,0,0,0.4); cursor:not-allowed; transform:none; box-shadow:none; }
        .btn:disabled::before { display:none; }

        .btnc { display:flex; align-items:center; justify-content:center; gap:10px; }
        .spin { width:13px; height:13px; border:1.5px solid rgba(0,0,0,0.2); border-top-color:#000;
          border-radius:50%; animation:spinning 0.65s linear infinite; }
        @keyframes spinning { to{transform:rotate(360deg)} }

        .ftr { margin-top:30px; display:flex; justify-content:space-between; align-items:center;
          opacity:0; transition:opacity 0.7s ease 0.6s; }
        .ftr.in { opacity:1; }
        .fl { font-size:12px; color:rgba(255,255,255,0.28); letter-spacing:0.02em; cursor:pointer;
          text-decoration:none; transition:color 0.2s; border:none; background:none; font-family:'DM Sans',sans-serif; }
        .fl:hover { color:rgba(255,255,255,0.65); }
        .fsep { width:1px; height:11px; background:rgba(255,255,255,0.1); }
      `}</style>

      <div className="lr" ref={containerRef}>
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="grid" />
        <div className="spotlight" style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }} />

        <div className={`card ${mounted ? "in" : ""}`}>
          <div className="scan" />
          <div className="c ctla" /><div className="c ctra" />
          <div className="c cbla" /><div className="c cbra" />

          <div className={`logo ${mounted ? "in" : ""}`}>
            <div className="logo-circle" />
            <span className="logo-name">Studio</span>
          </div>

          <div className={`hdg ${mounted ? "in" : ""}`}>
            <h1>Welcome <em>back.</em></h1>
          </div>
          <p className="sub">Sign in to continue your session</p>

          <form className={`form ${mounted ? "in" : ""}`} onSubmit={handleLogin}>
            {error && (
              <div className="err">
                <div className="errdot" />
                {error}
              </div>
            )}

            <div className={`ig ${focused === "email" ? "act" : ""} ${email ? "val" : ""}`}>
              <span className="lbl">Email address</span>
              <input className="inp" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                required autoComplete="email" />
              <div className="iline" />
            </div>

            <div className={`ig ${focused === "password" ? "act" : ""} ${password ? "val" : ""}`}>
              <span className="lbl">Password</span>
              <input className="inp" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                required autoComplete="current-password" />
              <div className="iline" />
            </div>

            <button className="btn" type="submit" disabled={loading}>
              <div className="btnc">
                {loading && <div className="spin" />}
                {loading ? "Authenticating…" : "Continue"}
              </div>
            </button>
          </form>

          <div className={`ftr ${mounted ? "in" : ""}`}>
            <button className="fl">Forgot password?</button>
            <div className="fsep" />
            <button className="fl" onClick={() => navigate("/register")}>Create account</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
