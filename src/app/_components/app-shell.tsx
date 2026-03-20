import { SideNav } from "./side-nav";
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col gap-4 overflow-hidden p-4 md:gap-6 md:p-6 lg:flex-row">
      <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-(--brand)/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-(--brand)/10 blur-3xl" />

      <aside className="sticky top-3 z-20 w-full shrink-0 lg:static lg:top-auto lg:z-auto lg:w-64">
        <SideNav />
      </aside>

      <main className="relative flex-1 overflow-auto rounded-2xl border border-(--line) bg-(--panel)/95 p-4 shadow-sm md:p-6">
        {children}
      </main>
    </div>
  );
}
