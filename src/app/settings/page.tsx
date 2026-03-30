import { AppShell } from "../_components/app-shell";

export default function SettingsPage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-(--muted)">App preferences and profile configuration.</p>
    </AppShell>
  );
}
