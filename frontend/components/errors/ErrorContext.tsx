'use client';
import React, { createContext, useContext, useState } from 'react';

type ErrorType = 'network' | 'notfound' | 'unauthorized' | 'generic';

interface ErrorState {
  open: boolean;
  type?: ErrorType;
  message?: string;
}

interface ErrorContextProps {
  error: ErrorState;
  setError: (err: ErrorState) => void;
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export const useError = () => {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error('useError must be used within ErrorProvider');
  return ctx;
};

export const ErrorProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [error, setError] = useState<ErrorState>({ open: false });
  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};