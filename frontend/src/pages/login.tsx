import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";
import { useAuth } from "../context/authcontext";
import { Button } from "../components/ui/Button";
import { Field, Input } from "../components/ui/Input";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate replace to="/dashboard" />;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-black px-4 py-10 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.16),transparent_28%),#050505]" />
      <form className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-premium backdrop-blur-xl" onSubmit={submit}>
        <Link className="mb-8 flex items-center gap-3" to="/">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-black">
            <Landmark size={20} />
          </div>
          <span className="font-semibold">BudgetWise AI</span>
        </Link>
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-zinc-400">Log in to your financial intelligence workspace.</p>
        <div className="mt-8 grid gap-4">
          <Field label="Email">
            <Input autoComplete="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Field label="Password">
            <Input autoComplete="current-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </Field>
          {error && <p className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          <Button disabled={loading} type="submit">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          New here?{" "}
          <Link className="font-semibold text-white" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
