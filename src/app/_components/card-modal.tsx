import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import React from 'react';

export const CardModal = ({
  modalRef,
  isOpen,
  onClose,
  title,
  children,
  closeOnBackgroundClick = true,
}: React.PropsWithChildren<{
  modalRef?: React.RefObject<HTMLDivElement | null> | null;
  isOpen: boolean;
  onClose: () => void;
  title?: string | null;
  closeOnBackgroundClick?: boolean;
}>) => {
  const modalBgRef = React.useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  return (
    <div
      onClick={closeOnBackgroundClick ? onClose : undefined}
      ref={modalBgRef}
      className={[
        'pointer-events-auto w-full h-full fixed top-0 left-0 z-40 flex items-center justify-center p-4  transition-opacity duration-500  ease-in-out ',
        isOpen ? 'bg-black/50' : 'bg-black/0',
      ].join(' ')}
    >
      <div
        ref={modalRef ?? null}
        className="flex flex-col items-stretch rounded-2xl transition ease-in-out duration-300 fixed top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] max-w-150 max-h-150 z-50"
      >
        {/* HEADER TITLE */}
        <div className="border border-(--line) bg-(--brand-strong) flex items-center justify-between p-6 rounded-tl-2xl rounded-tr-2xl ">
          <h2 className="mb-3 text-lg font-semibold text-(--panel)">{title ?? 'Title'}</h2>

          <button type="button" onClick={onClose} aria-label="Close modal">
            <FontAwesomeIcon icon={faXmark} className="text-(--muted)" />
          </button>
        </div>
        {/* BODY */}{' '}
        <div className="flex-1 border-t border-b border-(--line) bg-(--panel) p-6">
          {Array.isArray(children) && children[0]}
        </div>
        {/* FOOTER */}
        <div className="border border-(--line) bg-(--brand-strong) flex items-center justify-end p-6 rounded-bl-2xl rounded-br-2xl w-full">
          {Array.isArray(children) && children.length > 1 ? children[1] : null}
        </div>
      </div>
    </div>
  );
};
