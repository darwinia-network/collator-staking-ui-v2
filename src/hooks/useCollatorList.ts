import { useCallback } from 'react';
import useActiveCollators from './useActiveCollators';
import { useCollatorSet } from './useService';

export const useActiveCollatorList = ({ enabled }: { enabled: boolean }) => {
  const {
    data: activeCollators,
    isLoading: isActiveCollatorsLoading,
    isRefetching: isActiveCollatorsRefetching,
    refetch: refetchActiveCollators
  } = useActiveCollators({
    enabled
  });
  const {
    data: list,
    isLoading: isListLoading,
    isRefetching: isListRefetching,
    refetch: refetchList
  } = useCollatorSet({
    offset: 0,
    limit: activeCollators?.length || 0,
    enabled: !!activeCollators && enabled
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
  searchedAddress,
  page,
  pageSize
}: {
  enabled: boolean;
  page: number;
  pageSize: number;
  searchedAddress?: string;
}) => {
  const {
    data: activeCollators,
    isLoading: isActiveCollatorsLoading,
    isRefetching: isActiveCollatorsRefetching,
    refetch: refetchActiveCollators
  } = useActiveCollators({
    enabled
  });

  const activeCollatorsCount = activeCollators?.length || 0;
  const offset = searchedAddress ? 0 : activeCollatorsCount + (page - 1) * pageSize;

  const {
    data: waitingCollators,
    isLoading: isWaitingCollatorsLoading,
    isRefetching: isWaitingCollatorsRefetching,
    refetch: refetchWaitingCollators
  } = useCollatorSet({
    searchedAddress,
    offset,
    limit: pageSize,
    enabled: !!activeCollators && enabled
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
