import { useCallback, useMemo } from 'react';
import { useCollatorSet } from '@/hooks/useService';
import useActiveCollators from '@/hooks/useActiveCollators';
import useWalletStatus from '@/hooks/useWalletStatus';
import type { CollatorSet } from '@/service/type';

interface UseActiveAndWaitingCollatorsResult {
  all: CollatorSet[];
  active: CollatorSet[];
  waiting: CollatorSet[];
  isLoading: boolean;
  refetch: () => void;
}

export function useActiveAndWaitingCollators(): UseActiveAndWaitingCollatorsResult {
  const { currentChainId } = useWalletStatus();
  const {
    data: collators,
    isLoading: isCollatorSetLoading,
    isRefetching: isCollatorSetRefetching,
    error: collatorSetError,
    refetch: refetchCollatorSet
  } = useCollatorSet({
    currentChainId,
    enabled: false
  });

  const {
    data: activeCollators,
    isLoading: isActiveCollatorsLoading,
    isRefetching: isActiveCollatorsRefetching,
    error: activeCollatorsError,
    refetch: refetchContractCollators
  } = useActiveCollators({
    enabled: !!currentChainId && !!collators && !!collators?.length
  });

  const refetch = useCallback(() => {
    refetchCollatorSet();
    refetchContractCollators();
  }, [refetchCollatorSet, refetchContractCollators]);

  const isLoading = useMemo(() => {
    return (
      isCollatorSetLoading ||
      isActiveCollatorsLoading ||
      isCollatorSetRefetching ||
      isActiveCollatorsRefetching
    );
  }, [
    isCollatorSetLoading,
    isActiveCollatorsLoading,
    isCollatorSetRefetching,
    isActiveCollatorsRefetching
  ]);

  const result = useMemo(() => {
    if (isLoading) {
      return { active: [], waiting: [], all: [] };
    }

    if (collatorSetError || activeCollatorsError) {
      return { active: [], waiting: [], all: [] };
    }

    const activeCount = activeCollators?.length ? Number(activeCollators.length) : 0;
    const allCollators = [...(collators || [])];
    const active = allCollators.slice(0, activeCount);
    const waiting = allCollators.slice(activeCount);

    return {
      active,
      waiting,
      all: allCollators
    };
  }, [collators, activeCollators, collatorSetError, activeCollatorsError, isLoading]);

  return {
    ...result,
    isLoading,
    refetch
  };
}
