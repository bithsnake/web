"use client";

import { useId, useMemo, useState } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onDirtyChange?: (dirty: boolean) => void;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  sortAlphabetically?: boolean;
  validationMessage?: string;
  dirty?: boolean;
};

export function SelectField({
  label,
  value,
  onChange,
  onDirtyChange,
  placeholder,
  options,
  disabled = false,
  required = false,
  sortAlphabetically = false,
  validationMessage,
  dirty,
}: SelectFieldProps) {
  const [internalTouched, setInternalTouched] = useState(false);
  const id = useId();

  const orderedOptions = useMemo(() => {
    if (!sortAlphabetically) {
      return options;
    }

    return [...options].sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
    );
  }, [options, sortAlphabetically]);

  const chooseText = placeholder ?? `Choose ${label.toLowerCase()}`;
  const isDirty = dirty ?? internalTouched;
  const showValidation = required && isDirty && !value;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setInternalTouched(true);
          onDirtyChange?.(true);
        }}
        onBlur={() => {
          setInternalTouched(true);
          onDirtyChange?.(true);
        }}
        required={required}
        disabled={disabled}
        className={[
          "w-full cursor-pointer rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/20 disabled:cursor-not-allowed",
          showValidation
            ? "border-(--warn) ring-1 ring-(--warn)/25"
            : "border-(--line)",
        ].join(" ")}
      >
        <option value="">{chooseText}</option>
        {orderedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {showValidation ? (
        <p className="rounded-md border border-(--warn)/30 bg-(--warn)/10 px-2 py-1 text-xs text-(--warn)">
          {validationMessage ?? `Choose a ${label.toLowerCase()} to continue.`}
        </p>
      ) : null}
    </div>
  );
}
