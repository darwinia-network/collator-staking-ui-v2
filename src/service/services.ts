import { ChainId } from '@/types/chains';
import { getClient } from './client';
import { GET_COLLATOR_SET, GET_COLLATOR_SET_BY_INSET, GET_STAKING_ACCOUNT } from './queries';
import type {
  CollatorSet,
  CollatorSetQueryParams,
  StakingAccount,
  StakingAccountQueryParams
} from './type';

export async function fetchCollatorSet(
  params: CollatorSetQueryParams,
  chainId: ChainId
): Promise<CollatorSet[] | null> {
  const client = getClient(chainId);
  try {
    const response = await client.request<{ collatorSets: CollatorSet[] }>(
      GET_COLLATOR_SET,
      params
    );
    return response.collatorSets;
  } catch (error) {
    console.error('fetchCollatorSet failed:', error);
    return null;
  }
}

export async function fetchCollatorSetByAccounts(
  params: CollatorSetQueryParams,
  chainId: ChainId
): Promise<Pick<CollatorSet, 'address' | 'inset'>[] | null> {
  const client = getClient(chainId);
  try {
    const response = await client.request<{ collatorSets: CollatorSet[] }>(
      GET_COLLATOR_SET_BY_INSET,
      params
    );
    return response.collatorSets;
  } catch (error) {
    console.error('fetchCollatorSet failed:', error);
    return null;
  }
}

export async function fetchStakingAccount(
  params: StakingAccountQueryParams,
  chainId: ChainId
): Promise<StakingAccount[] | null> {
  const client = getClient(chainId);
  try {
    const response = await client.request<{ stakingAccounts: StakingAccount[] }>(
      GET_STAKING_ACCOUNT,
      params
    );
    return response.stakingAccounts;
  } catch (error) {
    console.error('fetchStakingAccount failed:', error);
    return null;
  }
}
