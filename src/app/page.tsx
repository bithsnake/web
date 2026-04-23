import Link from "next/link";
import { AppShell } from "./_components/shells/app-shell";

export default function HomePage() {
  return (
    <AppShell>
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-(--muted)">
          Hello!
        </p>
        <h1 className="text-3xl font-semibold">Welcome to Dentis</h1>
        <p className="max-w-2xl text-sm text-(--muted)">
          Start by exploring the core pages from the sidebar. First practical
          step is usually the patients page connected to your backend API.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-xl bg-(--brand) px-4 py-2 text-sm font-medium text-white hover:bg-(--brand-strong)"
        >
          Go to Dashboard
        </Link>
      </section>
    </AppShell>
  );
}
