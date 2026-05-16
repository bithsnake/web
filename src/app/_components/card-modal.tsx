import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import React, { SetStateAction, useEffect } from 'react';

export const CardModal = ({
  modalRef,
  isOpen = false,
  modalState,
  onClose,
  title,
  children,
  closeOnBackgroundClick = true,
}: React.PropsWithChildren<{
  modalRef?: React.RefObject<HTMLDivElement | null> | null;
  isOpen?: boolean;
  modalState: React.Dispatch<
    React.SetStateAction<{
      appointmentId: number | null;
      isOpen: boolean;
      isClosed: boolean;
    }>
  >;
  onClose: () => void;
  title?: string | null;
  closeOnBackgroundClick?: boolean;
}>) => {
  const modalBgRef = React.useRef<HTMLDivElement | null>(null);

  const [slide, setSlide] = React.useState(false);
  const [duration, setDuration] = React.useState(300);
  void setDuration;

  useEffect(() => {
    const slideIn = setTimeout(() => setSlide(true), 50);

    return () => {
      clearTimeout(slideIn);
    };
  }, [onClose, duration]);

  if (!isOpen) return null;

  const handleClose = () => {
    setSlide(false);
    const dismiss = setTimeout(() => {
      modalState?.((prev) => ({ ...prev, isClosed: true }));
      onClose();
      clearTimeout(dismiss);
    }, 300);
  };

  return (
    <div
      ref={modalBgRef}
      className={[
        'pointer-events-auto w-full h-full fixed top-0 left-0 z-40 flex items-center justify-center p-4 transition-all  duration-500  ease-in-out ',
        isOpen && slide ? 'bg-black/50' : 'bg-black/0',
      ].join(' ')}
    >
      <div
        ref={modalRef ?? null}
        className={[
          'fixed flex flex-col w-full max-w-2xl overflow-hidden rounded-2xl shadow-xl transition  duration-500 ease-in-out',
          isOpen && slide ? 'opacity-100 top-[50%] translate-y-[-50%]' : '-top-full opacity-0',
        ].join(' ')}
      >
        {/* HEADER TITLE */}
        <div className=" bg-(--brand-strong) flex items-center justify-between p-3 rounded-tl-2xl rounded-tr-2xl ">
          <h2 className=" m-0  text-lg font-semibold text-(--panel)">{title ?? 'Title'}</h2>

          <button type="button" onClick={handleClose} aria-label="Close modal">
            <FontAwesomeIcon icon={faXmark} className="text-(--panel) hover:text-(--danger)" />
          </button>
        </div>
        {/* BODY */}{' '}
        <div className="flex-1 border-t border-b border-(--line) bg-(--panel) p-8">
          {Array.isArray(children) && children[0]}
        </div>
        {/* FOOTER */}
        <div className="bg-(--brand-strong) flex items-center justify-end p-3 rounded-bl-2xl rounded-br-2xl w-full">
          {Array.isArray(children) && children.length > 1 ? children[1] : null}
        </div>
      </div>
    </div>
  );
};
