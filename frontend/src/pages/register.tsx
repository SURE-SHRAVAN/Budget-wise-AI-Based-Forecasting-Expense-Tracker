import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [strength, setStrength] = useState(0);
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
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);
  }, [password]);

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ff4d4d", "#ff9900", "#66ccff", "#00e676"][strength];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/register/", { email, username, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err: any) {
      setError(
        err.response?.data?.email?.[0] ||
        err.response?.data?.username?.[0] ||
        err.response?.data?.password?.[0] ||
        "Registration failed"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { background:#000; overflow:hidden; }

        .rr { min-height:100vh; width:100vw; display:flex; align-items:center; justify-content:center;
          font-family:'DM Sans',sans-serif; background:#000; position:relative; overflow:hidden; }

        .orb { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
        .o1 { width:700px; height:700px; background:radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 70%);
          top:-220px; right:-180px; animation:pa 10s ease-in-out infinite; }
        .o2 { width:550px; height:550px; background:radial-gradient(circle,rgba(130,130,130,0.09) 0%,transparent 70%);
          bottom:-160px; left:-160px; animation:pa 12s ease-in-out infinite reverse; }
        .o3 { width:300px; height:300px; background:radial-gradient(circle,rgba(255,255,255,0.05) 0%,transparent 70%);
          top:40%; left:30%; animation:pa3 8s ease-in-out infinite; }
        @keyframes pa { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.18);opacity:0.7} }
        @keyframes pa3 { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.25);opacity:0.5} }

        .grid { position:absolute; inset:0; pointer-events:none;
          background-image:linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);
          background-size:60px 60px; }

        .spotlight { position:absolute; width:480px; height:480px; border-radius:50%;
          background:radial-gradient(circle,rgba(255,255,255,0.04) 0%,transparent 70%);
          pointer-events:none; transform:translate(-50%,-50%); transition:left 0.4s ease,top 0.4s ease; }

        /* Card */
        .card { position:relative; width:440px; padding:52px 48px 48px;
          background:rgba(7,7,7,0.88); border:1px solid rgba(255,255,255,0.07);
          border-radius:3px; backdrop-filter:blur(40px); -webkit-backdrop-filter:blur(40px);
          box-shadow:0 0 0 1px rgba(255,255,255,0.025),0 50px 100px rgba(0,0,0,0.9),0 0 80px rgba(255,255,255,0.015) inset;
          transform:translateY(28px); opacity:0; transition:all 0.9s cubic-bezier(0.16,1,0.3,1); }
        .card.in { transform:translateY(0); opacity:1; }
        .card::before { content:''; position:absolute; inset:0; border-radius:3px; padding:1px;
          background:linear-gradient(135deg,rgba(255,255,255,0.13) 0%,transparent 45%,rgba(255,255,255,0.04) 100%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }

        .scan { position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
          animation:scan 8s linear infinite; pointer-events:none; }
        @keyframes scan { 0%{top:-1px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }

        .ca { position:absolute; width:14px; height:14px; opacity:0.22; }
        .tl { top:-1px; left:-1px; border-top:1px solid #fff; border-left:1px solid #fff; }
        .tr { top:-1px; right:-1px; border-top:1px solid #fff; border-right:1px solid #fff; }
        .bl { bottom:-1px; left:-1px; border-bottom:1px solid #fff; border-left:1px solid #fff; }
        .br { bottom:-1px; right:-1px; border-bottom:1px solid #fff; border-right:1px solid #fff; }

        /* Logo */
        .logo { display:flex; align-items:center; gap:10px; margin-bottom:44px;
          opacity:0; transform:translateY(8px); transition:all 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s; }
        .logo.in { opacity:1; transform:translateY(0); }
        .lc { width:26px; height:26px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .lc::after { content:''; width:11px; height:11px; background:#000; border-radius:50%; }
        .ln { font-family:'DM Serif Display',serif; font-size:17px; color:#fff; letter-spacing:0.02em; }

        /* Heading */
        .hdg { opacity:0; transform:translateY(8px); transition:all 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s; }
        .hdg.in { opacity:1; transform:translateY(0); }
        .hdg h1 { font-family:'DM Serif Display',serif; font-size:36px; color:#fff; font-weight:400;
          line-height:1.1; letter-spacing:-0.025em; }
        .hdg h1 em { font-style:italic; color:rgba(255,255,255,0.4); }
        .sub { font-size:12.5px; color:rgba(255,255,255,0.28); margin:6px 0 36px; font-weight:300; letter-spacing:0.015em; }

        /* Step indicator */
        .steps { display:flex; gap:6px; margin-bottom:32px;
          opacity:0; transition:opacity 0.7s ease 0.35s; }
        .steps.in { opacity:1; }
        .step { height:2px; flex:1; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden; position:relative; }
        .step-fill { height:100%; background:#fff; border-radius:2px;
          transition:width 0.6s cubic-bezier(0.16,1,0.3,1); }

        /* Form */
        .form { display:flex; flex-direction:column; gap:13px;
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
        .inp:focus { border-color:rgba(255,255,255,0.3); background:rgba(255,255,255,0.07);
          box-shadow:0 0 0 3px rgba(255,255,255,0.04); }

        .iline { position:absolute; bottom:0; left:50%; height:1px; width:0; background:#fff;
          transition:width 0.4s cubic-bezier(0.16,1,0.3,1),left 0.4s cubic-bezier(0.16,1,0.3,1); }
        .ig.act .iline { width:100%; left:0; }

        /* Password strength */
        .pw-meta { display:flex; flex-direction:column; gap:6px; }
        .strength-bar { display:flex; gap:4px; padding:0 2px; }
        .sb { height:2px; flex:1; border-radius:2px; background:rgba(255,255,255,0.08); overflow:hidden; }
        .sb-fill { height:100%; border-radius:2px; transition:width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease; }
        .strength-label { font-size:10.5px; letter-spacing:0.08em; text-transform:uppercase;
          padding:0 2px; transition:color 0.3s ease; font-weight:400; }

        /* Error */
        .err { display:flex; align-items:center; gap:8px; padding:11px 14px;
          background:rgba(255,70,70,0.07); border:1px solid rgba(255,70,70,0.18); border-radius:2px;
          font-size:12px; color:rgba(255,120,120,0.9); letter-spacing:0.01em;
          animation:shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97); }
        .errdot { width:5px; height:5px; background:rgba(255,90,90,0.8); border-radius:50%; flex-shrink:0; animation:blink 1.5s infinite; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* Success state */
        .success-overlay { position:absolute; inset:0; border-radius:3px;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;
          background:rgba(7,7,7,0.97); opacity:0; pointer-events:none;
          transition:opacity 0.5s ease; z-index:10; }
        .success-overlay.show { opacity:1; pointer-events:all; }
        .check-circle { width:56px; height:56px; border:1px solid rgba(255,255,255,0.2); border-radius:50%;
          display:flex; align-items:center; justify-content:center; animation:pop 0.5s cubic-bezier(0.16,1,0.3,1); }
        @keyframes pop { 0%{transform:scale(0.5);opacity:0} 100%{transform:scale(1);opacity:1} }
        .check-circle svg { animation:draw 0.6s ease 0.2s both; stroke-dasharray:30; stroke-dashoffset:30; }
        @keyframes draw { to{stroke-dashoffset:0} }
        .success-txt { font-family:'DM Serif Display',serif; font-size:22px; color:#fff; font-weight:400; letter-spacing:-0.01em; }
        .success-sub { font-size:12px; color:rgba(255,255,255,0.3); letter-spacing:0.04em; }
        .success-dots { display:flex; gap:6px; }
        .sdot { width:4px; height:4px; background:rgba(255,255,255,0.3); border-radius:50%; }
        .sdot:nth-child(1) { animation:sdot 1.2s 0s infinite; }
        .sdot:nth-child(2) { animation:sdot 1.2s 0.2s infinite; }
        .sdot:nth-child(3) { animation:sdot 1.2s 0.4s infinite; }
        @keyframes sdot { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }

        /* Button */
        .btn { position:relative; width:100%; padding:16px 24px; margin-top:4px;
          background:#fff; color:#000; border:none; border-radius:2px;
          font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500;
          letter-spacing:0.05em; cursor:pointer; overflow:hidden;
          transition:all 0.28s cubic-bezier(0.16,1,0.3,1); }
        .btn::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent);
          transition:left 0.55s cubic-bezier(0.16,1,0.3,1); }
        .btn:hover::before { left:100%; }
        .btn:hover { background:#e6e6e6; transform:translateY(-1px); box-shadow:0 10px 35px rgba(255,255,255,0.13); }
        .btn:active { transform:translateY(0); box-shadow:none; }
        .btn:disabled { background:rgba(255,255,255,0.16); color:rgba(0,0,0,0.4); cursor:not-allowed; transform:none; box-shadow:none; }
        .btn:disabled::before { display:none; }

        .btnc { display:flex; align-items:center; justify-content:center; gap:10px; }
        .spin { width:13px; height:13px; border:1.5px solid rgba(0,0,0,0.2); border-top-color:#000;
          border-radius:50%; animation:spinning 0.65s linear infinite; }
        @keyframes spinning { to{transform:rotate(360deg)} }

        /* Footer */
        .ftr { margin-top:28px; display:flex; justify-content:center; align-items:center; gap:8px;
          opacity:0; transition:opacity 0.7s ease 0.6s; }
        .ftr.in { opacity:1; }
        .fl { font-size:12px; color:rgba(255,255,255,0.28); letter-spacing:0.01em; }
        .flink { font-size:12px; color:rgba(255,255,255,0.55); cursor:pointer; background:none; border:none;
          font-family:'DM Sans',sans-serif; transition:color 0.2s; letter-spacing:0.01em; padding:0; }
        .flink:hover { color:#fff; }
        .fsep { width:1px; height:11px; background:rgba(255,255,255,0.1); }
      `}</style>

      <div className="rr" ref={containerRef}>
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
        <div className="grid" />
        <div className="spotlight" style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }} />

        <div className={`card ${mounted ? "in" : ""}`}>
          <div className="scan" />
          <div className="ca tl" /><div className="ca tr" />
          <div className="ca bl" /><div className="ca br" />

          {/* Success overlay */}
          <div className={`success-overlay ${success ? "show" : ""}`}>
            <div className="check-circle">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4,11 9,16 18,7" />
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="success-txt">Account created.</div>
              <div className="success-sub" style={{ marginTop: 6 }}>Redirecting to sign in</div>
            </div>
            <div className="success-dots">
              <div className="sdot" /><div className="sdot" /><div className="sdot" />
            </div>
          </div>

          {/* Logo */}
          <div className={`logo ${mounted ? "in" : ""}`}>
            <div className="lc" />
            <span className="ln">Studio</span>
          </div>

          {/* Heading */}
          <div className={`hdg ${mounted ? "in" : ""}`}>
            <h1>Create an <em>account.</em></h1>
          </div>
          <p className="sub">Join and get started in seconds</p>

          {/* Progress steps */}
          <div className={`steps ${mounted ? "in" : ""}`}>
            {[username, email, password].map((val, i) => (
              <div className="step" key={i}>
                <div className="step-fill" style={{ width: val ? "100%" : "0%" }} />
              </div>
            ))}
          </div>

          {/* Form */}
          <form className={`form ${mounted ? "in" : ""}`} onSubmit={handleRegister}>
            {error && (
              <div className="err">
                <div className="errdot" />
                {error}
              </div>
            )}

            {/* Username */}
            <div className={`ig ${focused === "username" ? "act" : ""} ${username ? "val" : ""}`}>
              <span className="lbl">Username</span>
              <input className="inp" type="text" value={username}
                onChange={e => setUsername(e.target.value)}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused(null)}
                required autoComplete="username" />
              <div className="iline" />
            </div>

            {/* Email */}
            <div className={`ig ${focused === "email" ? "act" : ""} ${email ? "val" : ""}`}>
              <span className="lbl">Email address</span>
              <input className="inp" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                required autoComplete="email" />
              <div className="iline" />
            </div>

            {/* Password */}
            <div className="pw-meta">
              <div className={`ig ${focused === "password" ? "act" : ""} ${password ? "val" : ""}`}>
                <span className="lbl">Password</span>
                <input className="inp" type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  required autoComplete="new-password" />
                <div className="iline" />
              </div>

              {/* Strength indicator */}
              {password.length > 0 && (
                <>
                  <div className="strength-bar">
                    {[1, 2, 3, 4].map(n => (
                      <div className="sb" key={n}>
                        <div className="sb-fill" style={{
                          width: strength >= n ? "100%" : "0%",
                          background: strengthColor,
                        }} />
                      </div>
                    ))}
                  </div>
                  <div className="strength-label" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </div>
                </>
              )}
            </div>

            <button className="btn" type="submit" disabled={loading || success}>
              <div className="btnc">
                {loading && <div className="spin" />}
                {loading ? "Creating account…" : "Create account"}
              </div>
            </button>
          </form>

          <div className={`ftr ${mounted ? "in" : ""}`}>
            <span className="fl">Already have an account?</span>
            <div className="fsep" />
            <button className="flink" onClick={() => navigate("/login")}>Sign in</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;