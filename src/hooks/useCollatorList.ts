import { useCallback } from 'react';
import useActiveCollators from './useActiveCollators';
import { useCollatorSet } from './useService';
import useWalletStatus from './useWalletStatus';

export const useActiveCollatorList = ({ enabled }: { enabled: boolean }) => {
  const { currentChainId } = useWalletStatus();
  const {
    data: activeCollators,
    isLoading: isActiveCollatorsLoading,
    isRefetching: isActiveCollatorsRefetching,
    refetch: refetchActiveCollators
  } = useActiveCollators({
    enabled: !!currentChainId && !!enabled
  });
  const {
    data: list,
    isLoading: isListLoading,
    isRefetching: isListRefetching,
    refetch: refetchList
  } = useCollatorSet({
    currentChainId: currentChainId,
    offset: 0,
    limit: activeCollators?.length || 0,
    enabled: !!currentChainId && !!activeCollators && !!enabled
  });

  const refetch = useCallback(() => {
    refetchActiveCollators();
    refetchList();
  }, [refetchActiveCollators, refetchList]);

  return {
    list,
    isLoading:
      isActiveCollatorsLoading || isListLoading || isActiveCollatorsRefetching || isListRefetching,
    refetch
  };
};

export const useWaitingCollatorList = ({
  enabled,
  page,
  pageSize
}: {
  enabled: boolean;
  page: number;
  pageSize: number;
}) => {
  const { currentChainId } = useWalletStatus();
  const {
    data: activeCollators,
    isLoading: isActiveCollatorsLoading,
    isRefetching: isActiveCollatorsRefetching,
    refetch: refetchActiveCollators
  } = useActiveCollators({
    enabled: !!currentChainId && enabled
  });

  const activeCollatorsCount = activeCollators?.length || 0;
  const offset = activeCollatorsCount + (page - 1) * pageSize;

  const {
    data: waitingCollators,
    isLoading: isWaitingCollatorsLoading,
    isRefetching: isWaitingCollatorsRefetching,
    refetch: refetchWaitingCollators
  } = useCollatorSet({
    currentChainId,
    offset,
    limit: pageSize,
    enabled: !!currentChainId && !!activeCollators && enabled
  });

  const refetch = useCallback(() => {
    refetchActiveCollators();
    refetchWaitingCollators();
  }, [refetchActiveCollators, refetchWaitingCollators]);

  return {
    list: waitingCollators,
    isLoading:
      isActiveCollatorsLoading ||
      isWaitingCollatorsLoading ||
      isActiveCollatorsRefetching ||
      isWaitingCollatorsRefetching,
    refetch
  };
};
