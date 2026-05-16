import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JSX, useEffect, useState } from 'react';

type SnackBarProps = {
  id: number;
  status: 'success' | 'error' | 'info';
  message: string;
  duration: number;
  onDismiss: (id: number) => void;
};

const statusColor = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};
const statusTitleObj = {
  success: 'Success!',
  error: 'Error!',
  info: 'Info!',
};

export const SnackBar: React.FC<SnackBarProps> = ({
  id,
  status,
  message,
  onDismiss,
  duration,
}): JSX.Element => {
  const [show, setShow] = useState(true);
  const [slide, setSlide] = useState(false);

  useEffect(() => {
    const slideIn = setTimeout(() => setSlide(true), 100);
    const slideOut = setTimeout(() => setSlide(false), duration);
    const dismiss = setTimeout(() => {
      setShow(false);
      onDismiss(id);
    }, duration + 500);

    return () => {
      clearTimeout(slideIn);
      clearTimeout(slideOut);
      clearTimeout(dismiss);
    };
  }, [id, onDismiss, duration]);

  const handleClose = () => {
    setSlide(false);
    setTimeout(() => {
      setShow(false);
      onDismiss(id);
    }, 300);
  };

  return (
    <div
      className={[
        'transition-all duration-300 ease-in-out fixed rounded-2xl text-(--panel) p-1 left-1/2 transform -translate-x-1/2 z-50',
        statusColor[status],

        show && slide ? 'bottom-4 opacity-100' : '-bottom-20 opacity-0',
      ].join(' ')}
    >
      <div className={['p-4 rounded shadow-md', statusColor[status]].join(' ')}>
        <div className="flex items-center justify-between mb-2 border-b ">
          <h2 className="font-bold text-xl  m-0">{statusTitleObj[status]}</h2>
          <FontAwesomeIcon
            icon={faXmark}
            className="cursor-pointer place-self-start "
            onClick={handleClose}
          />
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};
