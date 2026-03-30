import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";

type ElipsisHamburgerMenuProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  onActions: {
    onAction: (row: T) => void;
    actionLabel?: string | ((row: T) => string) | null;
    isActionDisabled?: ((row: T) => boolean) | null;
  }[];
};

export function ElipsisHamburger<T extends Record<string, unknown>>({
  onActions,
}: ElipsisHamburgerMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function onHandleSetShow(
    event: React.MouseEvent<HTMLButtonElement>,
    onAction: (row: T) => void,
  ): void {
    event.preventDefault();
    if (!onAction) return;

    onAction({} as T);
    setIsOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-md p-1 focus:outline-none"
      >
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          className="h-4 w-4 transition-colors duration-200 hover:text-[--brand]"
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-xl border border-[--brand]/20 bg-white shadow-xl animate-slideUp animate-fadeIn"
        >
          {onActions.map(
            ({ onAction, actionLabel, isActionDisabled }, index) => (
              <div
                key={
                  typeof actionLabel === "function"
                    ? actionLabel({} as T) || `no-label-${index}`
                    : actionLabel || `no-label-${index}`
                }
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={(event) => onHandleSetShow(event, onAction)}
                  disabled={
                    isActionDisabled ? isActionDisabled({} as T) : false
                  }
                  className="w-full px-4 py-2.5 text-left text-sm transition-all duration-200 ease-out hover:bg-[--brand]/8 hover:text-[--brand] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {typeof actionLabel === "function"
                    ? actionLabel({} as T) || `No label-${index}`
                    : actionLabel || `No label-${index}`}
                </button>
              </div>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

export default ElipsisHamburger;
