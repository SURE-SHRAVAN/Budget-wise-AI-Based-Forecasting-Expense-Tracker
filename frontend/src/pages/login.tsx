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
    <main className="grid min-h-screen place-items-center bg-primary px-4 py-10 text-ink">
      <div className="ambient-bg" />
      <form className="w-full max-w-md rounded-xl border border-line bg-white p-8 shadow-card backdrop-blur-xl" onSubmit={submit}>
        <Link className="mb-8 flex items-center gap-3" to="/">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white shadow-md">
            <Landmark size={20} />
          </div>
          <span className="font-semibold text-ink">BudgetWise AI</span>
        </Link>
        <h1 className="text-3xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-graphite">Log in to your financial intelligence workspace.</p>
        <div className="mt-8 grid gap-5">
          <Field label="Email">
            <Input autoComplete="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Field label="Password">
            <Input autoComplete="current-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </Field>
          {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 shadow-sm">{error}</p>}
          <Button disabled={loading} type="submit" className="w-full mt-2">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-graphite">
          New here?{" "}
          <Link className="font-semibold text-accent hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
