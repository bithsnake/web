import { FieldTranslations } from "@/lib/types";

type ObjectsTableProps<T extends Record<string, unknown>> = {
  data: T[] | null | undefined;
  fieldTranslations?: FieldTranslations;
  emptyText?: string;
  onRowClick?: (row: T) => void;
  onAction?: (row: T) => void;
  actionLabel?: string | ((row: T) => string);
  isActionDisabled?: (row: T) => boolean;
};

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
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
  if (!data || data.length === 0) {
    return <p className="text-sm text-(--muted)">{emptyText}</p>;
  }

  const columns = Object.keys(data[0]);

  return (
    <table className="w-full border-collapse text-sm">
      <thead className="bg-(--line) text-(--muted) uppercase">
        <tr>
          {columns.map((key) => (
            <th key={key} className="px-3 py-2 text-left">
              {fieldTranslations?.[key] ?? key}
            </th>
          ))}
          {onAction ? <th className="px-3 py-2 text-left">Actions</th> : null}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={String(row.id ?? index)}
            className="border-t border-(--line) hover:bg-(--line)"
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns.map((key) => (
              <td key={key} className="px-3 py-2">
                {formatCellValue(row[key])}
              </td>
            ))}
            {onAction ? (
              <td className="px-3 py-2">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onAction(row);
                  }}
                  disabled={isActionDisabled ? isActionDisabled(row) : false}
                  className="rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
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
