import { AppShell } from "../_components/app-shell";

export default function BillingPage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Billing</h1>
      <p className="mt-2 text-sm text-(--muted)">Invoice and payment overview.</p>
    </AppShell>
  );
}
