"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

const QUICK_CREATE_PANEL_STORAGE_KEY = "quick-create-panel-open";

type QuickCreatePanelProps = {
  children: ReactNode;
  panelTitle?: string;
  defaultOpen?: boolean;
};

export function QuickCreatePanel({
  children,
  panelTitle = "Quick Create",
  defaultOpen = false,
}: QuickCreatePanelProps) {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") {
      return defaultOpen;
    }

    const saved = localStorage.getItem(QUICK_CREATE_PANEL_STORAGE_KEY);
    if (saved === null) {
      return defaultOpen;
    }

    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(QUICK_CREATE_PANEL_STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  const actionLabel = useMemo(
    () => (isOpen ? "Hide" : panelTitle),
    [isOpen, panelTitle],
  );
  const icon = isOpen ? "<" : ">";

  return (
    <div className="flex items-stretch">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-label={
          isOpen ? "Hide quick create panel" : "Open quick create panel"
        }
        className="flex min-h-110 w-12 shrink-0 flex-col items-center rounded-l-2xl border border-(--line) bg-(--brand-strong) px-2 py-3 text-white shadow-sm transition hover:bg-(--brand)"
      >
        <span className="text-xs leading-none">{icon}</span>
        <span className="mt-2 text-[11px] font-semibold tracking-[0.16em] [writing-mode:vertical-rl]">
          {actionLabel.toUpperCase()}
        </span>
      </button>

      <div
        className={[
          "overflow-hidden rounded-r-2xl border-y border-r border-(--line) bg-(--panel) transition-all duration-300",
          isOpen ? "w-95 opacity-100" : "w-0 opacity-0",
        ].join(" ")}
      >
        <div className="p-4 md:p-5">{children}</div>
      </div>
    </div>
  );
}
