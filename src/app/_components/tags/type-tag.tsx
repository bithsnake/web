import { StatusTag, formatStatusLabel } from "./status-tag";

type TypeTagProps<TType extends string, TMap extends Record<TType, string>> = {
  typeValue: TType;
  colorMap: TMap;
};

export function TypeTag<
  TType extends string,
  TMap extends Record<TType, string>,
>({ typeValue, colorMap }: TypeTagProps<TType, TMap>) {
  const mappedColor = colorMap[typeValue];

  return (
    <StatusTag
      label={formatStatusLabel(typeValue)}
      tone="neutral"
      colorHex={mappedColor}
    />
  );
}
