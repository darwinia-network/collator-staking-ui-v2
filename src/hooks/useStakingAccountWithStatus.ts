import { useCallback, useMemo } from 'react';
import useWalletStatus from './useWalletStatus';
import { useStakingAccount } from './useService';
import { useCollatorsByStatus } from './useCollatorsByStatus';
import type { StakingAccount } from '@/service/type';
import type { CollatorStatus } from './useCollatorsByStatus';

export type StakingAccountWithStatus = StakingAccount & {
  status?: CollatorStatus;
};

function useStakingAccountWithStatus() {
  const { address, currentChainId } = useWalletStatus();

  const {
    data: collators,
    isLoading: isCollatorByStatusLoading,
    refetch: refetchCollatorByStatus
  } = useCollatorsByStatus();

  const {
    data,
    isLoading,
    isRefetching,
    refetch: refetchStakingAccount
  } = useStakingAccount({
    address,
    currentChainId
  });

  const refetch = useCallback(() => {
    refetchStakingAccount();
    refetchCollatorByStatus();
  }, [refetchStakingAccount, refetchCollatorByStatus]);

  const processedData = useMemo<StakingAccountWithStatus[]>(() => {
    if (!data) return [];

    const collatorStatusMap = new Map(
      collators.map((c) => [c.address.toLowerCase().trim(), c.status])
    );

    return data.map((account) => {
      const collatorAddress = account.collator.toLowerCase().trim();
      const status = collatorStatusMap.get(collatorAddress) ?? 'inactive';
      return {
        ...account,
        status
      };
    });
  }, [data, collators]);

  return {
    data: processedData,
    isLoading: isLoading || isRefetching || isCollatorByStatusLoading || isRefetching,
    refetch
  };
}

export default useStakingAccountWithStatus;
