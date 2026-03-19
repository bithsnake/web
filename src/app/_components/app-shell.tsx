
import { SideNav } from "./side-nav";
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen gap-6 overflow-hidden p-6">
      <aside className="w-64 shrink-0">
        <SideNav />
      </aside>

      <main className="flex-1 overflow-auto rounded-2xl border border-(--line) bg-(--panel) p-6">{children}</main>
    </div>
  );
}
