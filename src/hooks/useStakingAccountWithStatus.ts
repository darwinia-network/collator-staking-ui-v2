import { useCallback, useMemo } from 'react';
import useWalletStatus from './useWalletStatus';
import { useStakingAccount, useCollatorSetByAccounts } from './useService';
import type { StakingAccount } from '@/service/type';
import useActiveCollators from './useActiveCollators';

export type CollatorStatus = 'active' | 'inactive' | 'waiting';

export type StakingAccountWithStatus = StakingAccount & {
  status?: CollatorStatus;
};

function useStakingAccountWithStatus() {
  const { address, currentChainId, isEnabled } = useWalletStatus();

  const { data: activeCollators, refetch: refetchActiveCollators } = useActiveCollators({
    enabled: isEnabled
  });

  const {
    data,
    isLoading,
    isRefetching,
    refetch: refetchStakingAccount
  } = useStakingAccount({
    address,
    currentChainId
  });

  const { data: collatorSetByAccounts, refetch: refetchCollatorSetByAccounts } =
    useCollatorSetByAccounts({
      accounts: data?.map((account) => account.collator) ?? [],
      currentChainId,
      enabled: !!data?.length && isEnabled
    });

  const processedData = useMemo<StakingAccountWithStatus[]>(() => {
    if (!data) return [];

    const activeCollatorSet = new Set(activeCollators?.map((c) => c.toLowerCase().trim()) ?? []);

    return data.map((account) => {
      const collatorAddress = account.collator.toLowerCase().trim();
      const collatorSet = collatorSetByAccounts?.[collatorAddress];

      let status: CollatorStatus = 'waiting';
      if (collatorSet?.inset === 0) {
        status = 'inactive';
      } else if (activeCollatorSet.has(collatorAddress)) {
        status = 'active';
      }

      return {
        ...account,
        status
      };
    });
  }, [data, activeCollators, collatorSetByAccounts]);

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
