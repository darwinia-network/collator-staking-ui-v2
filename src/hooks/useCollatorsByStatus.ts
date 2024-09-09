import { useCallback, useMemo } from 'react';
import { useCollatorSetByInset } from '@/hooks/useService';
import useActiveCollatorCount from '@/hooks/useActiveCollatorCount';
import useWalletStatus from '@/hooks/useWalletStatus';
import type { CollatorSet } from '@/service/type';

export type CollatorStatus = 'active' | 'inactive' | 'waiting';

export interface CollatorInfo extends Pick<CollatorSet, 'address' | 'inset'> {
  status: CollatorStatus;
}

interface CollatorResult {
  data: CollatorInfo[];
  isLoading: boolean;
  refetch: () => void;
}

export function useCollatorsByStatus(): CollatorResult {
  const { currentChainId, isEnabled } = useWalletStatus();
  const collatorSetQuery = useCollatorSetByInset({
    currentChainId,
    enabled: isEnabled
  });

  const activeCollatorCountQuery = useActiveCollatorCount({
    enabled: !!currentChainId && !!collatorSetQuery.data?.length
  });

  const refetch = useCallback(() => {
    collatorSetQuery.refetch();
    activeCollatorCountQuery.refetch();
  }, [collatorSetQuery, activeCollatorCountQuery]);

  const result = useMemo(() => {
    if (collatorSetQuery.isLoading || activeCollatorCountQuery.isLoading) {
      return { data: [], refetch };
    }

    const error = collatorSetQuery.error || activeCollatorCountQuery.error;
    if (error) {
      return { data: [], refetch };
    }

    const activeCount = Number(activeCollatorCountQuery.data) || 0;
    const allCollators = collatorSetQuery.data || [];

    return {
      data: allCollators.map((collator, index) => ({
        ...collator,
        status: !collator.inset
          ? 'inactive'
          : index < activeCount
            ? 'active'
            : ('waiting' as CollatorStatus)
      })),
      refetch
    };
  }, [collatorSetQuery, activeCollatorCountQuery, refetch]);

  return {
    ...result,
    isLoading:
      collatorSetQuery.isLoading ||
      activeCollatorCountQuery.isLoading ||
      collatorSetQuery.isRefetching ||
      activeCollatorCountQuery.isRefetching
  };
}
