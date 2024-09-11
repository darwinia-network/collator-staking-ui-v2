import { useQuery } from '@tanstack/react-query';

import {
  fetchCollatorSet,
  fetchCollatorSetByAccounts,
  fetchStakingAccount
} from '@/service/services';
import type { CollatorSetQueryParams, StakingAccountQueryParams } from '@/service/type';

type CollatorSetParams = {
  currentChainId?: number;
  currentKey?: string;
  enabled?: boolean;
  offset: number;
  limit: number;
  searchedAddress?: string;
};
export function useCollatorSet({
  currentChainId,
  searchedAddress,
  offset,
  limit,
  enabled = true
}: CollatorSetParams) {
  const params: CollatorSetQueryParams = {
    where: {
      chainId: {
        _eq: currentChainId
      },
      ...(searchedAddress ? { address: { _eq: searchedAddress?.toLowerCase() } } : {}),
      inset: {
        _eq: 1
      }
    },
    offset,
    limit,
    orderBy: [{ key: 'desc' }]
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

type CollatorSetPrevParams = {
  currentChainId?: number;
  key?: string;
  enabled?: boolean;
};
export function useCollatorSetPrev({ currentChainId, key, enabled = true }: CollatorSetPrevParams) {
  const params: CollatorSetQueryParams = {
    where: {
      chainId: {
        _eq: currentChainId
      },
      inset: {
        _eq: 1
      },
      key: {
        _gt: key
      }
    },
    orderBy: [{ key: 'asc' }],
    limit: 1
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
    enabled: !!currentChainId && !!key && !!enabled
  });
}

export function useCollatorSetNewPrev({
  currentChainId,
  key,
  newKey,
  enabled = true
}: CollatorSetParams & { key: string; newKey: string }) {
  const params: CollatorSetQueryParams = {
    where: {
      chainId: {
        _eq: currentChainId
      },
      inset: {
        _eq: 1
      },
      key: {
        _gt: newKey
      },
      _and: [
        {
          key: {
            _neq: key
          }
        }
      ]
    },
    orderBy: [{ key: 'asc' }],
    limit: 1
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
    enabled: !!currentChainId && !!key && !!newKey && !!enabled
  });
}

type CollatorByAddressParams = {
  currentChainId?: number;
  address: `0x${string}`;
  enabled?: boolean;
};
export function useCollatorByAddress({
  currentChainId,
  address,
  enabled = true
}: CollatorByAddressParams) {
  const params: CollatorSetQueryParams = {
    where: {
      chainId: {
        _eq: currentChainId
      },
      ...(address ? { address: { _eq: address?.toLowerCase() } } : {}),
      inset: {
        _eq: 1
      }
    },
    orderBy: [{ key: 'desc' }]
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
    enabled: !!currentChainId && !!address && !!enabled
  });
}

type CollatorSetByAccountsParams = {
  accounts: `0x${string}`[];
  currentChainId?: number;
  enabled?: boolean;
};
export function useCollatorSetByAccounts({
  currentChainId,
  accounts,
  enabled = true
}: CollatorSetByAccountsParams) {
  const params: CollatorSetQueryParams = {
    where: {
      chainId: {
        _eq: currentChainId
      },
      id: {
        _in: accounts?.map((account) => account?.toLowerCase())
      }
    },
    orderBy: [{ key: 'asc' }]
  };
  return useQuery({
    queryKey: ['collatorSetByAccounts', params],
    queryFn: async () => {
      const result = await fetchCollatorSetByAccounts(params);
      if (result === null) {
        throw new Error('Failed to fetch collator set by accounts');
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
        _eq: address?.toLowerCase()
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
