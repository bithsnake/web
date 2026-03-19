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

  return (
    <nav className="w-full rounded-2xl border border-(--line) bg-(--panel) p-3">
      <div className="mb-3 px-2 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-(--muted)">Dentis</div>

      <ul className="flex flex-col gap-1">
        {links.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "block rounded-xl px-3 py-2 text-sm transition",
                  active ? "bg-(--brand) text-white" : "text-(--ink) hover:bg-(--hover)",
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
