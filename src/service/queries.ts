import { gql } from 'graphql-request';

export const GET_COLLATOR_SET = gql`
  query GetCollatorSet(
    $skip: Int
    $first: Int
    $orderBy: CollatorSet_orderBy
    $orderDirection: OrderDirection
    $where: CollatorSet_filter
  ) {
    collatorSets(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      address
      assets
      blockNumber
      id
      commission
      inset
      key
      logIndex
      pool
      prev
      reward
      votes
    }
  }
`;

export const GET_COLLATOR_SET_BY_INSET = gql`
  query GetCollatorSetByAccount(
    $skip: Int
    $first: Int
    $orderBy: CollatorSet_orderBy
    $orderDirection: OrderDirection
    $where: CollatorSet_filter
  ) {
    collatorSets(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      address
      inset
    }
  }
`;

export const GET_STAKING_ACCOUNT = gql`
  query GetStakingAccount(
    $skip: Int
    $first: Int
    $orderBy: StakingAccount_orderBy
    $orderDirection: OrderDirection
    $where: StakingAccount_filter
  ) {
    stakingAccounts(
      distinct_on: $distinctOn
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: $where
    ) {
      account
      assets
      collator
      id
      pool
    }
  }
`;
