import { APPOINTMENT_TYPE_COLOR_TONE_MAP } from "@/lib/types";
import { StatusTag, formatStatusLabel, getStatusTone } from "./tags/status-tag";
import { TypeTag } from "./tags/type-tag";

function renderCardCell(column: string, value: unknown): React.ReactNode {
  const normalizedColumn = column.trim().toLowerCase();

  if (normalizedColumn === "status" && typeof value === "string") {
    return (
      <StatusTag label={formatStatusLabel(value)} tone={getStatusTone(value)} />
    );
  }

  if (normalizedColumn === "type" && typeof value === "string") {
    return (
      <TypeTag
        typeValue={value}
        colorMap={APPOINTMENT_TYPE_COLOR_TONE_MAP as Record<string, string>}
      />
    );
  }

  return value === null || value === undefined ? "-" : String(value);
}

export function CardTable({
  columns,
  data,
}: {
  columns: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
}) {
  return (
    <div className="h-full overflow-hidden rounded-b-lg border-l border-r border-b border-(--line)">
      <table className="card-table-layout w-full border-collapse">
        <thead className="bg-gray-100">
          <tr className="border-b border-(--line)">
            {columns.map((column) => (
              <th
                key={column}
                className="border-b border-(--line) px-4 py-2 text-left"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="hover-scrollbar divide-y divide-(--line)">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column} className="border-b border-(--line) px-4 py-2">
                  {renderCardCell(column, row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100">
          <tr>
            <td
              colSpan={columns.length}
              className="border-t border-(--line) px-4 py-2 text-center text-sm text-gray-500"
            >
              {data.length} {data.length === 1 ? "record" : "records"}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
