import { BILLING_STATUS, StatusTagTone } from "@/lib/types";
import type { CSSProperties } from "react";

type StatusTagProps = {
  label: string;
  tone?: StatusTagTone;
  colorHex?: string;
};

export function formatStatusLabel(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getStatusTone(status: string): StatusTagTone {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "SCHEDULED":
      return "info";
    case "ONGOING":
      return "warning";
    case "COMPLETED":
      return "success";
    case "CANCELED":
      return "danger";
    case "DELETED":
      return "neutral";
  }
  // add billing status tones
  const billingStatuses: string[] = [
    "INVOICED",
    "PAID",
    "CANCELED",
    "DELETED",
    "OVERDUE",
  ] as (typeof BILLING_STATUS)[keyof typeof BILLING_STATUS][];
  if (
    billingStatuses.includes(
      normalized as (typeof BILLING_STATUS)[keyof typeof BILLING_STATUS],
    )
  ) {
    switch (normalized) {
      case "INVOICED":
        return "info";
      case "PAID":
        return "success";
      case "CANCELED":
        return "danger";
      case "DELETED":
        return "neutral";
      case "OVERDUE":
        return "warning";
    }
  }
  return "neutral";
}

function getToneClassName(tone: StatusTagTone): string {
  switch (tone) {
    case "success":
      return "border-emerald-200 bg-emerald-100 text-emerald-700";
    case "warning":
      return "border-amber-200 bg-amber-100 text-amber-700";
    case "info":
      return "border-(--brand)/30 bg-(--brand)/10 text-(--brand)";
    case "danger":
      return "border-(--warn)/30 bg-(--warn)/10 text-(--warn)";
    default:
      return "border-(--line) bg-(--line)/50 text-(--ink)";
  }
}

function toRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return `rgba(148, 163, 184, ${alpha})`;
  }

  const red = Number.parseInt(full.slice(0, 2), 16);
  const green = Number.parseInt(full.slice(2, 4), 16);
  const blue = Number.parseInt(full.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function toRgb(
  hex: string,
): { red: number; green: number; blue: number } | null {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return null;
  }

  return {
    red: Number.parseInt(full.slice(0, 2), 16),
    green: Number.parseInt(full.slice(2, 4), 16),
    blue: Number.parseInt(full.slice(4, 6), 16),
  };
}

function toDarkerTextHex(hex: string): string {
  const rgb = toRgb(hex);
  if (!rgb) {
    return "#334155";
  }

  // Keep hue identity while improving readability against pastel backgrounds.
  const darkenFactor = 0.42;
  const red = Math.round(rgb.red * darkenFactor)
    .toString(16)
    .padStart(2, "0");
  const green = Math.round(rgb.green * darkenFactor)
    .toString(16)
    .padStart(2, "0");
  const blue = Math.round(rgb.blue * darkenFactor)
    .toString(16)
    .padStart(2, "0");

  return `#${red}${green}${blue}`;
}

export function StatusTag({
  label,
  tone = "neutral",
  colorHex,
}: StatusTagProps) {
  const customStyle: CSSProperties | undefined = colorHex
    ? {
        borderColor: toRgba(colorHex, 0.58),
        backgroundColor: toRgba(colorHex, 0.34),
        color: toDarkerTextHex(colorHex),
      }
    : undefined;

  return (
    <span
      className={[
        "inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold",
        getToneClassName(tone),
      ].join(" ")}
      style={customStyle}
    >
      {label}
    </span>
  );
}
