import { useQuery } from '@tanstack/react-query';

import { fetchCollatorSet, fetchCollatorSetByInset, fetchStakingAccount } from '@/service/services';
import type { CollatorSetQueryParams, StakingAccountQueryParams } from '@/service/type';

type CollatorSetParams = {
  currentChainId?: number;
  enabled?: boolean;
};
export function useCollatorSet({ currentChainId, enabled = true }: CollatorSetParams) {
  const params: CollatorSetQueryParams = {
    where: {
      chainId: {
        _eq: currentChainId
      },
      inset: {
        _eq: 1
      }
    },
    orderBy: [{ seq: 'asc' }, { votes: 'desc' }, { blockNumber: 'desc' }, { logIndex: 'desc' }]
  };

  return useQuery({
    queryKey: ['collatorSet', params],
    queryFn: async () => {
      const result = await fetchCollatorSet(params);
      if (result === null) {
        throw new Error('Failed to fetch collator set');
      }
      return result;
    },
    enabled: !!currentChainId && !!enabled
  });
}

export function useCollatorSetByInset({ currentChainId, enabled = true }: CollatorSetParams) {
  const params: CollatorSetQueryParams = {
    where: { chainId: { _eq: currentChainId } },
    orderBy: [{ seq: 'asc' }, { votes: 'desc' }, { blockNumber: 'desc' }, { logIndex: 'desc' }]
  };
  return useQuery({
    queryKey: ['collatorSetByInset', params],
    queryFn: async () => {
      const result = await fetchCollatorSetByInset(params);
      if (result === null) {
        throw new Error('Failed to fetch collator set by inset');
      }
      return result;
    },
    enabled: !!currentChainId && !!enabled
  });
}

export type StakingAccountParams = {
  address?: string;
  currentChainId?: number;
};
export function useStakingAccount({ address, currentChainId }: StakingAccountParams) {
  const params: StakingAccountQueryParams = {
    where: {
      account: {
        _eq: address
      },
      chainId: {
        _eq: currentChainId
      }
    }
  };
  const queryKey = ['stakingAccount', params];
  const result = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await fetchStakingAccount(params);
      if (result === null) {
        throw new Error('Failed to fetch staking account');
      }
      return result;
    },
    enabled: !!address && !!currentChainId
  });

  return { ...result, queryKey };
}
