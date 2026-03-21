import { useMemo, useState } from "react";
import { FieldTranslations } from "@/lib/types";
import { StatusTag, formatStatusLabel, getStatusTone } from "./status-tag";

type ObjectsTableProps<T extends Record<string, unknown>> = {
  data: T[] | null | undefined;
  fieldTranslations?: FieldTranslations;
  emptyText?: string;
  onRowClick?: (row: T) => void;
  onAction?: (row: T) => void;
  actionLabel?: string | ((row: T) => string);
  isActionDisabled?: (row: T) => boolean;
};

type SortDirection = "asc" | "desc";

type SortState = {
  key: string;
  direction: SortDirection;
} | null;

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function renderCellValue(key: string, value: unknown): React.ReactNode {
  if (key === "status" && typeof value === "string") {
    return (
      <StatusTag label={formatStatusLabel(value)} tone={getStatusTone(value)} />
    );
  }

  return formatCellValue(value);
}

function tryParseDate(value: string): number | null {
  const isDateLike = /^\d{4}-\d{2}-\d{2}/.test(value);
  if (!isDateLike) {
    return null;
  }

  const date = Date.parse(value);
  return Number.isNaN(date) ? null : date;
}

function compareUnknownValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  if (typeof a === "string" && typeof b === "string") {
    const parsedDateA = tryParseDate(a);
    const parsedDateB = tryParseDate(b);
    if (parsedDateA !== null && parsedDateB !== null) {
      return parsedDateA - parsedDateB;
    }

    const parsedNumberA = Number(a);
    const parsedNumberB = Number(b);
    if (!Number.isNaN(parsedNumberA) && !Number.isNaN(parsedNumberB)) {
      return parsedNumberA - parsedNumberB;
    }

    const normalizedA = a.toLowerCase();
    const normalizedB = b.toLowerCase();
    const firstCharCompare = normalizedA
      .charAt(0)
      .localeCompare(normalizedB.charAt(0));

    return firstCharCompare !== 0
      ? firstCharCompare
      : normalizedA.localeCompare(normalizedB);
  }

  const normalizedA = formatCellValue(a).toLowerCase();
  const normalizedB = formatCellValue(b).toLowerCase();

  return normalizedA.localeCompare(normalizedB);
}

export function ObjectsTable<T extends Record<string, unknown>>({
  data,
  fieldTranslations,
  emptyText = "No data available.",
  onRowClick,
  onAction,
  actionLabel = "Action",
  isActionDisabled,
}: ObjectsTableProps<T>) {
  const [sortState, setSortState] = useState<SortState>(null);

  const columns = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const dataKeys = Object.keys(data[0]);

    if (!fieldTranslations) {
      return dataKeys;
    }

    const translationOrderedKeys = Object.keys(fieldTranslations).filter(
      (key) => dataKeys.includes(key),
    );
    const remainingDataKeys = dataKeys.filter(
      (key) => !translationOrderedKeys.includes(key),
    );

    return [...translationOrderedKeys, ...remainingDataKeys];
  }, [data, fieldTranslations]);

  const sortedData = useMemo(() => {
    if (!sortState || !data || data.length === 0) {
      return data ?? [];
    }

    const sorted = [...data].sort((rowA, rowB) =>
      compareUnknownValues(rowA[sortState.key], rowB[sortState.key]),
    );

    if (sortState.direction === "desc") {
      sorted.reverse();
    }

    return sorted;
  }, [data, sortState]);

  const handleColumnSort = (columnKey: string) => {
    setSortState((currentSort) => {
      if (!currentSort || currentSort.key !== columnKey) {
        return { key: columnKey, direction: "asc" };
      }

      return {
        key: columnKey,
        direction: currentSort.direction === "asc" ? "desc" : "asc",
      };
    });
  };

  if (!data || data.length === 0) {
    return <p className="text-sm text-(--muted)">{emptyText}</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead className="bg-(--line) text-(--muted) uppercase">
        <tr>
          {columns.map((key) => (
            <th key={key} className="px-4 py-3 text-left text-xs tracking-wide">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-left hover:cursor-pointer"
                onClick={() => handleColumnSort(key)}
              >
                <span>{fieldTranslations?.[key] ?? key}</span>
                {sortState?.key === key ? (
                  <span aria-hidden="true">
                    {sortState.direction === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  <span aria-hidden="true" className="opacity-40">
                    ↕
                  </span>
                )}
              </button>
            </th>
          ))}
          {onAction ? (
            <th className="px-4 py-3 text-left text-xs tracking-wide">
              Actions
            </th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, index) => (
          <tr
            key={String(row.id ?? index)}
            className={[
              "border-t border-(--line) transition-colors hover:bg-(--line)/45",
              onRowClick ? "hover:cursor-pointer" : "",
            ].join(" ")}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns.map((key) => (
              <td key={key} className="px-4 py-3 align-top">
                {renderCellValue(key, row[key])}
              </td>
            ))}
            {onAction ? (
              <td className="px-4 py-3">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onAction(row);
                  }}
                  disabled={isActionDisabled ? isActionDisabled(row) : false}
                  className="rounded-lg border border-(--line) bg-white px-2.5 py-1.5 text-xs font-medium text-(--ink) shadow-sm transition hover:bg-(--line) disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {typeof actionLabel === "function"
                    ? actionLabel(row)
                    : actionLabel}
                </button>
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
