import { ButtonHTMLAttributes, ReactNode } from "react";

type BrandButtonVariant = "primary" | "alternate";

type BrandButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: BrandButtonVariant;
};

export function BrandButton({
  children,
  variant = "primary",
  className,
  type = "button",
  ...rest
}: BrandButtonProps) {
  const variantClassName =
    variant === "alternate"
      ? "border-(--line) bg-white text-(--ink) hover:bg-(--line) focus-visible:ring-(--line)/70"
      : "border-(--brand-strong)/45 bg-(--brand) text-(--panel) hover:bg-(--brand-strong) focus-visible:ring-(--brand)/40";

  const mergedClassName = [
    "relative inline-flex items-center justify-center overflow-hidden rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
    "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.5)_45%,rgba(255,255,255,0)_100%)] before:opacity-0 before:translate-x-[-120%] before:transition-[opacity,transform] before:duration-300 active:before:opacity-100 active:before:translate-x-[120%]",
    variantClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={mergedClassName} {...rest}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
