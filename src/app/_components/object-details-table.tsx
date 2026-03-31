"use client";

import { ObjectDetailsTableProps } from "@/lib/types";
import { StatusTag, formatStatusLabel, getStatusTone } from "./status-tag";

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "-";

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  if (typeof value === "string") {
    const maybeDate = new Date(value);
    const looksLikeIsoDate =
      !Number.isNaN(maybeDate.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(value);

    return looksLikeIsoDate ? maybeDate.toLocaleString() : value;
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function fallbackLabel(key: string): string {
  // camelCase -> Camel Case
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

function renderDetailsValue(
  key: string,
  value: unknown,
  typeColorMap?: Record<string, string>,
): React.ReactNode {
  if (key === "status" && typeof value === "string") {
    return (
      <StatusTag label={formatStatusLabel(value)} tone={getStatusTone(value)} />
    );
  }

  if (key === "type" && typeof value === "string" && typeColorMap) {
    const mappedColor = typeColorMap[value];

    return (
      <StatusTag
        label={formatStatusLabel(value)}
        tone="neutral"
        colorHex={mappedColor}
      />
    );
  }

  return formatValue(value);
}

export function ObjectDetailsTable<T extends Record<string, unknown>>({
  data,
  fieldTranslations = {},
  emptyText = "No details available.",
  typeColorMap,
}: ObjectDetailsTableProps<T>) {
  if (!data) {
    return <p className="text-sm text-(--muted)">{emptyText}</p>;
  }

  const entries = Object.entries(data);

  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {entries.map(([key, value]) => (
          <tr key={key} className="border-t border-(--line)">
            <th className="w-48 bg-(--line) px-3 py-2 text-left font-semibold">
              {fieldTranslations[key] ?? fallbackLabel(key)}
            </th>
            <td className="px-3 py-2">
              {renderDetailsValue(key, value, typeColorMap)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
