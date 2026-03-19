import { AppShell } from "../_components/app-shell";

export default function AppointmentsPage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Appointments</h1>
      <p className="mt-2 text-sm text-(--muted)">Upcoming and completed appointments.</p>
    </AppShell>
  );
}
