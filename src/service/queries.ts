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
      seq
      votes
      reward
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

// 根据 nomination-collator-account 维度查询 质押
// TODO
// 这里可以用这个语句来查询,
// StakingAccount 就是这里的列表,
// 如果 StakingAccount 里面的 collator 不在 CollatorSet[].address 这数组里面, 那么就表明这个状态是 inactive, 否则就是 active | waiting , 这两个状态区分要在合约去查询了
// @Echo
//  会和你说
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
