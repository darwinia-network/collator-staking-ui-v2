import { useContext } from 'react';
import { WaitingIndexingContext } from './context';

export function useWaitingIndexing() {
  const context = useContext(WaitingIndexingContext);
  if (!context) {
    throw new Error('useWaitingIndexing must be used within a WaitingIndexingProvider');
  }
  return context;
}
