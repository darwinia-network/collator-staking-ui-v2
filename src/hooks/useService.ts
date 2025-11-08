import { useQuery } from '@tanstack/react-query';

import {
  fetchCollatorSet,
  fetchCollatorSetByAccounts,
  fetchLastRewardDistributeds,
  fetchStakingAccount
} from '@/service/services';
import type {
  CollatorSetQueryParams,
  StakingAccountQueryParams
} from '@/service/type';
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
  const { isEnabled, currentChainId } = useWalletStatus();
  const params: CollatorSetQueryParams = {
    where: {
      ...(searchedAddress ? { address: toLowerCase(searchedAddress) } : {}),
      inset: 1
    },
    skip: offset,
    first: limit,
    orderBy: 'key',
    orderDirection: 'desc'
  };

  return useQuery({
    queryKey: ['collatorSet', params, currentChainId],
    queryFn: async () => {
      const result = await fetchCollatorSet(params, currentChainId!);

      if (result === null) {
        throw new Error('Failed to fetch collator set');
      }
      return result;
    },
    placeholderData: (prevData) => prevData,
    enabled: isEnabled && enabled
  });
}

type LastRewardDistributedsParams = {
  addresses: `0x${string}`[];
  enabled?: boolean;
};

export function useLastRewardDistributeds({
  addresses,
  enabled = true
}: LastRewardDistributedsParams) {
  const { isEnabled, currentChainId } = useWalletStatus();

  return useQuery({
    queryKey: ['lastRewardDistributeds', addresses.join('-'), currentChainId],
    queryFn: async () => {
      const result = await fetchLastRewardDistributeds(addresses, currentChainId!);

      if (result === null) {
        throw new Error('Failed to fetch reward distributeds');
      }

      return result;
    },
    placeholderData: (previousData) => previousData,
    enabled: isEnabled && enabled && addresses.length > 0
  });
}

export const fetchCollatorSetPrev = async ({
  key,
  collatorAddress,
  currentChainId
}: {
  key: string;
  collatorAddress: `0x${string}`;
  currentChainId: number;
}) => {
  const params: CollatorSetQueryParams = {
    where: {
      inset: 1,
      key_gt: key,
      id_not: collatorAddress
    },
    orderBy: 'key',
    orderDirection: 'asc',
    first: 1,
    skip: 0
  };

  const result = await fetchCollatorSet(params, currentChainId!);
  if (result === null) {
    throw new Error('Failed to fetch collator set');
  }
  return result;
};

type CollatorSetNewPrevParams = {
  collatorAddress?: `0x${string}`;
  newKey?: string;
  enabled?: boolean;
};

export function useCollatorSetNewPrev({
  collatorAddress,
  newKey,
  enabled = true
}: CollatorSetNewPrevParams) {
  const { currentChainId, isEnabled } = useWalletStatus();

  const params: CollatorSetQueryParams = {
    where: {
      inset: 1,
      key_gt: newKey,
      id_not: collatorAddress
    },
    orderBy: 'key',
    orderDirection: 'asc',
    first: 1,
    skip: 0
  };

  return useQuery({
    queryKey: ['collatorSetNewPrev', params, currentChainId],
    queryFn: async () => {
      const result = await fetchCollatorSet(params, currentChainId!);
      if (result === null) {
        throw new Error('Failed to fetch collator set');
      }
      return result;
    },
    enabled: isEnabled && !!collatorAddress && !!newKey && enabled
  });
}
export const fetchCollatorSetNewPrev = async ({
  collatorAddress,
  newKey,
  currentChainId
}: {
  collatorAddress: `0x${string}`;
  newKey: string;
  currentChainId: number;
}) => {
  const params: CollatorSetQueryParams = {
    where: {
      inset: 1,
      key_gt: newKey,
      id_not: collatorAddress
    },
    orderBy: 'key',
    orderDirection: 'asc',
    first: 1,
    skip: 0
  };

  const result = await fetchCollatorSet(params, currentChainId!);
  if (result === null) {
    throw new Error('Failed to fetch collator set');
  }
  return result;
};

type CollatorByAddressParams = {
  address: `0x${string}`;
  enabled?: boolean;
  inset?: number;
};
export function useCollatorByAddress({ address, enabled = true, inset }: CollatorByAddressParams) {
  const { currentChainId, isEnabled } = useWalletStatus();

  const params: CollatorSetQueryParams = {
    where: {
      ...(address ? { address: toLowerCase(address) } : {}),
      ...(inset !== undefined ? { inset } : {})
    },
    orderBy: 'key',
    orderDirection: 'desc',
    skip: 0,
    first: 1
  };

  return useQuery({
    queryKey: ['collatorByAddress', params, currentChainId],
    queryFn: async () => {
      const result = await fetchCollatorSet(params, currentChainId!);
      if (result === null) {
        throw new Error('Failed to fetch collator set');
      }
      return result;
    },
    enabled: isEnabled && !!address && enabled,
    staleTime: 0
  });
}

export const fetchCollatorByAddress = async ({
  address,
  currentChainId
}: {
  address: `0x${string}`;
  currentChainId: number;
}) => {
  const params: CollatorSetQueryParams = {
    where: {
      ...(address ? { address: toLowerCase(address) } : {}),
      inset: 1
    },
    orderBy: 'key',
    orderDirection: 'desc',
    skip: 0,
    first: 1
  };
  const result = await fetchCollatorSet(params, currentChainId!);
  if (result === null) {
    throw new Error('Failed to fetch collator set');
  }
  return result;
};

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
      id_in: accounts?.map((account) => toLowerCase(account))
    },
    orderBy: 'key',
    orderDirection: 'asc',
    skip: 0,
    first: 1000
  };
  return useQuery({
    queryKey: ['collatorSetByAccounts', params, currentChainId],
    queryFn: async () => {
      const result = await fetchCollatorSetByAccounts(params, currentChainId!);
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
      account: toLowerCase(address)
    },
    orderBy: 'latestChangeTimestamp',
    orderDirection: 'desc'
  };
  const queryKey = ['stakingAccounts', params, currentChainId];
  const result = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await fetchStakingAccount(params, currentChainId!);
      if (result === null) {
        throw new Error('Failed to fetch staking account');
      }
      return result;
    },
    enabled: isEnabled && enabled
  });

  return { ...result, queryKey };
}
