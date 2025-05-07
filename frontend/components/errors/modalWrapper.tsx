
'use client';
import { useError } from './ErrorContext';
import { GlobalErrorModal } from './GlobalErrorModal';

export default function ErrorModalWrapper() {
  const { error, setError } = useError();
  return (
    <GlobalErrorModal
      open={error.open}
      type={error.type}
      message={error.message}
      onClose={() => setError({ open: false })}
    />
  );
}