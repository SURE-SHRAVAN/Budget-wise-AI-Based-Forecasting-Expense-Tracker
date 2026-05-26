import { useState, type FormEvent } from "react";
import { Bell, Download, Moon, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, Input, Select } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../context/authcontext";

const Settings = () => {
  const { updateProfile, user } = useAuth();
  const [form, setForm] = useState({
    username: user?.username ?? "",
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    currency: user?.currency ?? "INR",
    theme: user?.theme ?? "dark",
    notifications_enabled: user?.notifications_enabled ?? true,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
  };

  return (
    <div>
      <PageHeader eyebrow="Workspace" title="Settings" />

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Profile and preferences</h2>
          <form className="mt-6 grid gap-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <Input value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} />
              </Field>
              <Field label="Last name">
                <Input value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} />
              </Field>
            </div>
            <Field label="Username">
              <Input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Currency">
                <Select value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </Select>
              </Field>
              <Field label="Theme">
                <Select value={form.theme} onChange={(event) => setForm({ ...form, theme: event.target.value as "system" | "light" | "dark" })}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </Select>
              </Field>
            </div>
            <label className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 p-4">
              <span className="flex items-center gap-3">
                <Bell size={18} />
                Notifications
              </span>
              <input
                checked={form.notifications_enabled}
                className="h-5 w-5 accent-white"
                onChange={(event) => setForm({ ...form, notifications_enabled: event.target.checked })}
                type="checkbox"
              />
            </label>
            <Button disabled={saving} type="submit">{saving ? "Saving..." : "Save settings"}</Button>
          </form>
        </Card>

        <aside className="grid content-start gap-4">
          {[
            { icon: Moon, title: "Theme system", text: "Prepared for dark, light, and system preference modes." },
            { icon: Download, title: "Export data", text: "CSV export is available from the transactions page." },
            { icon: ShieldAlert, title: "Security", text: "JWT refresh rotation and token blacklist are enabled." },
            { icon: Trash2, title: "Account deletion", text: "Danger-zone architecture is ready for backend policy approval." },
          ].map((item) => (
            <Card className="p-5" key={item.title}>
              <item.icon size={19} />
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
            </Card>
          ))}
        </aside>
      </section>
    </div>
  );
};

export default Settings;
