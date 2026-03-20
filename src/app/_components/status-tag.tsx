type StatusTagTone = "success" | "warning" | "info" | "danger" | "neutral";

type StatusTagProps = {
  label: string;
  tone?: StatusTagTone;
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

  if (normalized === "COMPLETED" || normalized === "SENT") {
    return "success";
  }

  if (normalized === "CANCELED" || normalized === "FAILED") {
    return "danger";
  }

  if (normalized === "SCHEDULED" || normalized === "PENDING") {
    return "info";
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

export function StatusTag({ label, tone = "neutral" }: StatusTagProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold",
        getToneClassName(tone),
      ].join(" ")}
    >
      {label}
    </span>
  );
}
