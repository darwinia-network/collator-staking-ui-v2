import { createContext, useState, ReactNode } from 'react';
import WaitingIndexing from '@/components/waiting-indexing';

interface WaitingIndexingContextProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const WaitingIndexingContext = createContext<WaitingIndexingContextProps | undefined>(
  undefined
);

export function WaitingIndexingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <WaitingIndexingContext.Provider value={{ isOpen, open, close }}>
      {children}
      <WaitingIndexing isOpen={isOpen} onClose={close} />
    </WaitingIndexingContext.Provider>
  );
}
