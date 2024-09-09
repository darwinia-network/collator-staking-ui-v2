import { useCallback, useMemo } from 'react';
import { useCollatorSet } from '@/hooks/useService';
import useActiveCollatorCount from '@/hooks/useActiveCollatorCount';
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
    data: activeCollatorCount,
    isLoading: isContractCollatorsLoading,
    isRefetching: isContractCollatorsRefetching,
    error: contractCollatorsError,
    refetch: refetchContractCollators
  } = useActiveCollatorCount({
    enabled: !!currentChainId && !!collators && !!collators?.length
  });

  const refetch = useCallback(() => {
    refetchCollatorSet();
    refetchContractCollators();
  }, [refetchCollatorSet, refetchContractCollators]);

  const isLoading = useMemo(() => {
    return (
      isCollatorSetLoading ||
      isContractCollatorsLoading ||
      isCollatorSetRefetching ||
      isContractCollatorsRefetching
    );
  }, [
    isCollatorSetLoading,
    isContractCollatorsLoading,
    isCollatorSetRefetching,
    isContractCollatorsRefetching
  ]);

  const result = useMemo(() => {
    if (isLoading) {
      return { active: [], waiting: [], all: [] };
    }

    if (collatorSetError || contractCollatorsError) {
      return { active: [], waiting: [], all: [] };
    }

    const activeCount = activeCollatorCount ? Number(activeCollatorCount) : 0;
    const allCollators = [...(collators || [])];
    const activeCollators = allCollators.slice(0, activeCount);
    const waitingCollators = allCollators.slice(activeCount);

    return {
      active: activeCollators,
      waiting: waitingCollators,
      all: allCollators
    };
  }, [collators, activeCollatorCount, collatorSetError, contractCollatorsError, isLoading]);

  return {
    ...result,
    isLoading,
    refetch
  };
}
