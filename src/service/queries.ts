import { gql } from 'graphql-request';

export const GET_COLLATOR_SET = gql`
  query GetCollatorSet(
    $distinctOn: [CollatorSet_select_column!]
    $limit: Int
    $offset: Int
    $orderBy: [CollatorSet_order_by!]
    $where: CollatorSet_bool_exp
  ) {
    CollatorSet(
      distinct_on: $distinctOn
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: $where
    ) {
      address
      assets
      chainId
      commission
      id
      inset
      pool
      prev
      votes
      reward
      key
    }
  }
`;

export const GET_COLLATOR_SET_BY_INSET = gql`
  query GetCollatorSetByAccount(
    $distinctOn: [CollatorSet_select_column!]
    $limit: Int
    $offset: Int
    $orderBy: [CollatorSet_order_by!]
    $where: CollatorSet_bool_exp
  ) {
    CollatorSet(
      distinct_on: $distinctOn
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: $where
    ) {
      address
      inset
    }
  }
`;

export const GET_STAKING_ACCOUNT = gql`
  query GetStakingAccount(
    $distinctOn: [StakingAccount_select_column!]
    $limit: Int
    $offset: Int
    $orderBy: [StakingAccount_order_by!]
    $where: StakingAccount_bool_exp
  ) {
    StakingAccount(
      distinct_on: $distinctOn
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: $where
    ) {
      account
      assets
      chainId
      collator
      id
      pool
    }
  }
`;
