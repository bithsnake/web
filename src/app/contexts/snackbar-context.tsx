'use client';

import { SnackBar } from '@/app/_components/snackbar';
import { SECONDS } from '@/lib/constants';
import { createContext, useCallback, useState } from 'react';

const SnackBarContext = createContext<
  ((status: 'success' | 'error' | 'info', message: string) => void) | null
>(null);

export const SnackBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackBars, setSnackBars] = useState<
    {
      id: number;
      status: 'success' | 'error' | 'info';
      message: string;
    }[]
  >([]);

  const dismiss = useCallback((id: number) => {
    console.log('dismiss id: ', id);

    setSnackBars((prev) => prev.filter((sb) => sb.id !== id));
  }, []);

  // const _show = (status: 'success' | 'error' | 'info', message: string) =>
  //   setSnackBars((prev) => [...prev, { id: new Date().getTime(), status, message }]);

  const show = useCallback((status: 'success' | 'error' | 'info', message: string) => {
    setSnackBars((prev) => [...prev, { id: new Date().getTime(), status, message }]);
  }, []);

  return (
    <SnackBarContext.Provider value={show}>
      {children}
      {snackBars.map((snackBar) => (
        <SnackBar
          key={snackBar.id}
          id={snackBar.id}
          duration={SECONDS.three}
          status={snackBar.status}
          message={snackBar.message}
          onDismiss={dismiss}
        />
      ))}
    </SnackBarContext.Provider>
  );
};

export default SnackBarContext;
