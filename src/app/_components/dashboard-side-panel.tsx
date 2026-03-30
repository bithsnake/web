"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

const DASHBOARD_SIDE_PANEL_STORAGE_KEY = "dashboard-side-panel-open";

type DashboardSidePanelProps = {
  children: ReactNode;
  panelTitle?: string;
  defaultOpen?: boolean;
};

export function DashboardSidePanel({
  children,
  panelTitle = "Widgets",
  defaultOpen = true,
}: DashboardSidePanelProps) {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") {
      return defaultOpen;
    }

    const saved = localStorage.getItem(DASHBOARD_SIDE_PANEL_STORAGE_KEY);
    if (saved === null) {
      return defaultOpen;
    }

    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(DASHBOARD_SIDE_PANEL_STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  const actionLabel = useMemo(
    () => (isOpen ? "Hide" : panelTitle),
    [isOpen, panelTitle],
  );

  return (
    <div className="flex items-stretch self-start">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-label={
          isOpen
            ? "Hide dashboard widgets panel"
            : "Open dashboard widgets panel"
        }
        className="flex h-full w-11 shrink-0 flex-col items-center rounded-l-2xl border border-(--line) bg-(--brand-strong) px-2 py-3 text-white shadow-sm transition hover:bg-(--brand)"
      >
        <span className="text-xs leading-none">{isOpen ? "<" : ">"}</span>
        <span className="mt-2 text-[11px] font-semibold tracking-[0.16em] [writing-mode:vertical-rl]">
          {actionLabel.toUpperCase()}
        </span>
      </button>

      <div
        className={[
          "overflow-hidden rounded-r-2xl border-y border-r border-(--line) bg-(--panel) transition-all duration-300",
          isOpen ? "w-72 opacity-100" : "w-0 opacity-0",
        ].join(" ")}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
