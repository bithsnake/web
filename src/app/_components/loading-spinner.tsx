type LoadingSpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
}

const SIZE_MAP: Record<LoadingSpinnerSize, string> = {
  sm: "w-6 h-6 border border-2",
  md: "w-10 h-10 border border-2",
  lg: "w-16 h-16 border-4",
};

export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  return (
    <div
      className={`${SIZE_MAP[size]} inline-block rounded-full border-solid border-(--line) border-t-(--brand) animate-spin`}
    />
  );
}
