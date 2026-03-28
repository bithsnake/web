import { type CSSProperties } from "react";

export function Grid({
  children,
  columns = 2,
  mobileColumns = 1,
}: {
  children: React.ReactNode;
  columns?: number;
  mobileColumns?: number;
}) {
  const gridStyle = {
    "--grid-cols-mobile": mobileColumns,
    "--grid-cols-desktop": columns,
  } as CSSProperties;

  return (
    <div
      className="grid w-full gap-8 [grid-template-columns:repeat(var(--grid-cols-mobile),minmax(0,1fr))] lg:[grid-template-columns:repeat(var(--grid-cols-desktop),minmax(0,1fr))]"
      style={gridStyle}
    >
      {children}
    </div>
  );
}

export function GridItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default Grid;
