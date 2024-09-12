import { useQuery } from '@tanstack/react-query';

import {
  fetchCollatorSet,
  fetchCollatorSetByAccounts,
  fetchStakingAccount
} from '@/service/services';
import type { CollatorSetQueryParams, StakingAccountQueryParams } from '@/service/type';
import useWalletStatus from './useWalletStatus';

const toLowerCase = (value: string | undefined) => (value ? value.toLowerCase() : '');

type CollatorSetParams = {
  currentKey?: string;
  enabled?: boolean;
  offset: number;
  limit: number;
  searchedAddress?: string;
};
export function useCollatorSet({
  searchedAddress,
  offset,
  limit,
  enabled = true
}: CollatorSetParams) {
  const { currentChainId, isEnabled } = useWalletStatus();
  const params: CollatorSetQueryParams = {
    where: {
      chainId: {
        _eq: currentChainId
      },
      ...(searchedAddress ? { address: { _eq: toLowerCase(searchedAddress) } } : {}),
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
    enabled: isEnabled && enabled
  });
}

type CollatorSetPrevParams = {
  key?: string;
  enabled?: boolean;
};
export function useCollatorSetPrev({ key, enabled = true }: CollatorSetPrevParams) {
  const { currentChainId, isEnabled } = useWalletStatus();

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
    enabled: isEnabled && !!key && enabled
  });
}

type CollatorSetNewPrevParams = {
  key?: string;
  newKey?: string;
  enabled?: boolean;
};
export function useCollatorSetNewPrev({ key, newKey, enabled = true }: CollatorSetNewPrevParams) {
  const { currentChainId, isEnabled } = useWalletStatus();

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
    enabled: isEnabled && !!key && !!newKey && !!enabled
  });
}

type CollatorByAddressParams = {
  address: `0x${string}`;
  enabled?: boolean;
};
export function useCollatorByAddress({ address, enabled = true }: CollatorByAddressParams) {
  const { currentChainId, isEnabled } = useWalletStatus();

  const params: CollatorSetQueryParams = {
    where: {
      chainId: {
        _eq: currentChainId
      },
      ...(address ? { address: { _eq: toLowerCase(address) } } : {}),
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
    enabled: isEnabled && !!address && enabled,
    staleTime: 0
  });
}

type CollatorSetByAccountsParams = {
  accounts: `0x${string}`[];
  enabled?: boolean;
};
export function useCollatorSetByAccounts({
  accounts,
  enabled = true
}: CollatorSetByAccountsParams) {
  const { currentChainId, isEnabled } = useWalletStatus();
  const params: CollatorSetQueryParams = {
    where: {
      chainId: {
        _eq: currentChainId
      },
      id: {
        _in: accounts?.map((account) => toLowerCase(account))
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
    enabled: isEnabled && enabled
  });
}

type StakingAccountParams = {
  enabled?: boolean;
};
export function useStakingAccount({ enabled = true }: StakingAccountParams) {
  const { currentChainId, address, isEnabled } = useWalletStatus();

  const params: StakingAccountQueryParams = {
    where: {
      account: {
        _eq: toLowerCase(address)
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
    enabled: isEnabled && enabled
  });

  return { ...result, queryKey };
}
