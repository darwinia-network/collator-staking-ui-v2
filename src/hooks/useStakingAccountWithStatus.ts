import { useCallback, useMemo } from 'react';
import { useStakingAccount, useCollatorSetByAccounts } from './useService';
import type { StakingAccount } from '@/service/type';
import useActiveCollators from './useActiveCollators';

export type CollatorStatus = 'active' | 'inactive' | 'waiting';

export type StakingAccountWithStatus = StakingAccount & {
  status?: CollatorStatus;
};

function useStakingAccountWithStatus() {
  const {
    data: activeCollators,
    refetch: refetchActiveCollators,
    isLoading: isLoadingActiveCollators,
    isRefetching: isRefetchingActiveCollators
  } = useActiveCollators({
    enabled: true
  });

  const {
    data,
    isLoading,
    isRefetching,
    refetch: refetchStakingAccount
  } = useStakingAccount({
    enabled: true
  });

  const { data: collatorSetByAccounts, refetch: refetchCollatorSetByAccounts } =
    useCollatorSetByAccounts({
      accounts: data?.map((account) => account.collator) ?? [],
      enabled: !!data?.length
    });

  const processedData = useMemo<StakingAccountWithStatus[]>(() => {
    if (!data) return [];

    const activeCollatorSet = new Set(activeCollators?.map((c) => c.toLowerCase().trim()) ?? []);

    return data.map((account) => {
      const collatorAddress = account.collator.toLowerCase().trim();
      const collatorSet = collatorSetByAccounts?.find(
        (c) => c.address?.toLowerCase() === collatorAddress
      );

      let status: CollatorStatus | undefined = undefined;
      if (isLoadingActiveCollators || isRefetchingActiveCollators) {
        status = undefined;
      } else if (collatorSet?.inset === 0) {
        status = 'inactive';
      } else if (activeCollatorSet.has(collatorAddress)) {
        status = 'active';
      } else {
        status = 'waiting';
      }

      return {
        ...account,
        status
      };
    });
  }, [
    data,
    activeCollators,
    collatorSetByAccounts,
    isLoadingActiveCollators,
    isRefetchingActiveCollators
  ]);

  const refetch = useCallback(() => {
    refetchActiveCollators();
    refetchStakingAccount();
    refetchCollatorSetByAccounts();
  }, [refetchStakingAccount, refetchActiveCollators, refetchCollatorSetByAccounts]);

  return {
    data: processedData,
    isLoading: isLoading || isRefetching,
    refetch
  };
}

export default useStakingAccountWithStatus;
