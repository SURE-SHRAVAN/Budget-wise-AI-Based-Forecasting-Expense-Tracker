import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";
import { useAuth } from "../context/authcontext";
import { Button } from "../components/ui/Button";
import { Field, Input } from "../components/ui/Input";
import axios from "axios";

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
    
    // Frontend validation just in case
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (!/\d/.test(form.password) || !/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[^A-Za-z0-9]/.test(form.password)) {
      setError("Password must contain at least one uppercase, one lowercase, one number, and one special character.");
      setLoading(false);
      return;
    }

    try {
      await register(form.email, form.username, form.password);
      navigate("/dashboard");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data) {
        // Extract specific backend errors if available
        const data = err.response.data;
        let errorMessage = "Registration failed. Please check your inputs.";
        if (data.email) errorMessage = data.email[0];
        else if (data.username) errorMessage = data.username[0];
        else if (data.password) errorMessage = Array.isArray(data.password) ? data.password[0] : data.password;
        setError(errorMessage);
      } else {
        setError("Registration failed. Please try again.");
      }
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
        <h1 className="text-3xl font-semibold text-ink">Create workspace</h1>
        <p className="mt-2 text-sm text-graphite">Start with secure auth, analytics, and an AI finance copilot.</p>
        <div className="mt-8 grid gap-5">
          <Field label="Username">
            <Input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          </Field>
          <Field label="Email">
            <Input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </Field>
          <Field label="Password">
            <Input required minLength={6} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </Field>
          {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 shadow-sm">{error}</p>}
          <Button disabled={loading} type="submit" className="w-full mt-2">
            {loading ? "Creating..." : "Register"}
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-graphite">
          Already have an account?{" "}
          <Link className="font-semibold text-accent hover:underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
