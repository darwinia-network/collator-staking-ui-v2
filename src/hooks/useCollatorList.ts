import { useCallback, useMemo } from 'react';
import useActiveCollators from './useActiveCollators';
import { useCollatorSet, useLastRewardDistributeds } from './useService';
import type { CollatorSet, RewardDistributed } from '@/service/type';

export type CollatorWithLastReward = CollatorSet & {
  lastReward?: RewardDistributed | null;
};

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

  const collatorAddresses = useMemo<`0x${string}`[]>(() => {
    if (!list?.length) {
      return [];
    }

    return list.map((item) => item.address.toLowerCase() as `0x${string}`);
  }, [list]);

  const {
    data: rewardMap,
    isLoading: isRewardsLoading,
    isRefetching: isRewardsRefetching,
    refetch: refetchRewards
  } = useLastRewardDistributeds({
    addresses: collatorAddresses,
    enabled: collatorAddresses.length > 0 && enabled
  });

  const listWithRewards = useMemo<CollatorWithLastReward[] | undefined>(() => {
    if (!list) {
      return list;
    }

    if (!rewardMap) {
      return list as CollatorWithLastReward[];
    }

    return list.map((item) => {
      const key = item.address.toLowerCase() as `0x${string}`;

      return {
        ...item,
        lastReward: rewardMap[key] ?? null
      };
    });
  }, [list, rewardMap]);

  const refetch = useCallback(() => {
    refetchActiveCollators();
    refetchList();
    refetchRewards();
  }, [refetchActiveCollators, refetchList, refetchRewards]);

  const isCollatorListLoading =
    isActiveCollatorsLoading ||
    isListLoading ||
    isActiveCollatorsRefetching ||
    isListRefetching;

  const isRewardInfoLoading = isRewardsLoading || isRewardsRefetching;

  return {
    list: listWithRewards,
    isLoading: isCollatorListLoading,
    isRewardInfoLoading,
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
