import { ShellProps } from "@/lib/component.types";
import { JSX } from "react";

interface WidgetShellProps extends ShellProps {
  label: string;
  width?: string | number;
  height?: string | number;
}

export function WidgetShell({
  children,
  label,
  width = "32rem",
  height = "24rem",
}: WidgetShellProps): JSX.Element {
  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-(--line) bg-(--panel)/95 p-4 shadow-sm md:p-6"
      style={{ width, height, maxWidth: "100%" }}
    >
      <h2 className="rounded-tl-lg rounded-tr-lg border-l border-t border-r border-(--line) bg-(--brand-strong) px-3 py-1 text-lg font-semibold text-(--panel)">
        {label}
      </h2>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
