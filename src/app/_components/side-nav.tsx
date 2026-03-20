"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/appointments", label: "Appointments" },
  { href: "/billing", label: "Billing" },
  { href: "/settings", label: "Settings" },
];

export function SideNav() {
  const pathname = usePathname();

  const isActivePath = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="w-full rounded-2xl border border-(--line) bg-(--panel)/95 p-3 shadow-sm backdrop-blur-sm">
      <div className="mb-3 rounded-xl border border-(--line) bg-white/70 px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">
          Dentis
        </p>
        <p className="mt-1 text-sm font-medium text-(--ink)">Operations Desk</p>
      </div>

      <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {links.map((item) => {
          const active = isActivePath(item.href);
          return (
            <li key={item.href} className="shrink-0 lg:shrink">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "block whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 focus-visible:ring-offset-(--panel)",
                  active
                    ? "bg-(--brand-strong) text-white! font-semibold shadow-sm"
                    : "text-(--ink) hover:bg-(--line)/65 hover:text-(--ink)",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
