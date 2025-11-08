import { ChainId } from '../types/chains';
import { getClient } from './client';
import {
  GET_COLLATOR_SET,
  GET_COLLATOR_SET_BY_INSET,
  GET_DEPLOYMENT_META,
  GET_STAKING_ACCOUNT,
  createRewardDistributedDocument
} from './queries';
import type {
  CollatorSet,
  CollatorSetQueryParams,
  DeploymentMetaResponse,
  RewardDistributed,
  StakingAccount,
  StakingAccountQueryParams
} from './type';
import type { GraphQLClient } from 'graphql-request';

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

type FetchLastRewardDistributedsOptions = {
  client?: GraphQLClient;
};

export async function fetchLastRewardDistributeds(
  addresses: `0x${string}`[],
  chainId: ChainId,
  options?: FetchLastRewardDistributedsOptions
): Promise<Record<string, RewardDistributed | null> | null> {
  if (!addresses.length) {
    return {};
  }

  const client = options?.client ?? getClient(chainId);
  const { document, aliasMap } = createRewardDistributedDocument(addresses);

  try {
    const response = await client.request<Record<string, RewardDistributed[]>>(document);

    return aliasMap.reduce<Record<string, RewardDistributed | null>>((acc, { alias, address }) => {
      const record = response?.[alias]?.[0];
      acc[address] = record ?? null;
      return acc;
    }, {});
  } catch (error) {
    console.error('fetchLastRewardDistributeds failed:', error);
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

export async function fetchDeploymentMeta(
  chainId: ChainId
): Promise<DeploymentMetaResponse | null> {
  const client = getClient(chainId);

  try {
    const data = await client.request<DeploymentMetaResponse>(GET_DEPLOYMENT_META);
    return data;
  } catch (error) {
    console.error('fetchDeploymentMeta failed:', error);
    return null;
  }
}
