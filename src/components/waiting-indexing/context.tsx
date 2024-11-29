import { createContext, useState, ReactNode } from 'react';
import WaitingIndexing from '@/components/waiting-indexing';
import IndexingErrorModal from '@/components/waiting-indexing/error-modal'; // Assuming this component exists

interface WaitingIndexingContextProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  openError: () => void;
  closeError: () => void;
  isErrorOpen: boolean;
}

export const WaitingIndexingContext = createContext<WaitingIndexingContextProps | undefined>(
  undefined
);

export function WaitingIndexingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const openError = () => setIsErrorOpen(true);
  const closeError = () => setIsErrorOpen(false);

  return (
    <WaitingIndexingContext.Provider
      value={{ isOpen, open, close, isErrorOpen, openError, closeError }}
    >
      {children}
      <WaitingIndexing isOpen={isOpen} onClose={close} />
      <IndexingErrorModal isOpen={isErrorOpen} onClose={closeError} />
    </WaitingIndexingContext.Provider>
  );
}
