import { SideNav } from "./side-nav";

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const rootClassName = [
    "relative flex min-h-screen w-full flex-col gap-4 overflow-hidden p-4 md:gap-6 md:p-6 lg:flex-row",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-(--brand)/10 blur-3xl" />

      <aside className="sticky top-3 z-20 w-full shrink-0 lg:static lg:top-auto lg:z-auto lg:w-64">
        <SideNav />
      </aside>

      <main className="relative flex-1 overflow-auto rounded-2xl border border-(--line) bg-(--panel)/95 p-4 shadow-sm md:p-6">
        {children}
      </main>
    </div>
  );
}
