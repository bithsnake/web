import { AppShell } from "../_components/app-shell";

export default function DashBoardPage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-(--muted)">Snapshot of appointments, reminders, and billing status.</p>
    </AppShell>
  );
}
