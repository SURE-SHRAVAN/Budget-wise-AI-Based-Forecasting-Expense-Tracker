import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";
import { useAuth } from "../context/authcontext";
import { Button } from "../components/ui/Button";
import { Field, Input } from "../components/ui/Input";

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate replace to="/dashboard" />;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form.email, form.username, form.password);
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Use a stronger password and a unique email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-black px-4 py-10 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,.18),transparent_26%),#050505]" />
      <form className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-premium backdrop-blur-xl" onSubmit={submit}>
        <Link className="mb-8 flex items-center gap-3" to="/">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-black">
            <Landmark size={20} />
          </div>
          <span className="font-semibold">BudgetWise AI</span>
        </Link>
        <h1 className="text-3xl font-semibold">Create workspace</h1>
        <p className="mt-2 text-sm text-zinc-400">Start with secure auth, analytics, and an AI finance copilot.</p>
        <div className="mt-8 grid gap-4">
          <Field label="Username">
            <Input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          </Field>
          <Field label="Email">
            <Input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </Field>
          <Field label="Password">
            <Input required minLength={10} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </Field>
          {error && <p className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          <Button disabled={loading} type="submit">
            {loading ? "Creating..." : "Register"}
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link className="font-semibold text-white" to="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
