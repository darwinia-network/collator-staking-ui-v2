export interface CollatorSet {
  id: string;
  address: `0x${string}`;
  prev?: string;
  key?: string;
  votes?: string;
  pool?: string;
  commission?: string;
  assets?: string;
  reward?: string;
  inset?: number;
}
export type CollatorSetOrderByField =
  | 'id'
  | 'address'
  | 'prev'
  | 'key'
  | 'votes'
  | 'pool'
  | 'commission'
  | 'assets'
  | 'reward'
  | 'inset'
  | 'blockNumber'
  | 'logIndex'
  | 'blockTimestamp';

export type OrderDirection = 'asc' | 'desc';
export type StringComparisonExp = string;
export type IDComparisonExp = string | number;
export type BigIntComparisonExp = string | number;
export type IntComparisonExp = number;
export interface CollatorSet_filter {
  id?: IDComparisonExp;
  id_not?: IDComparisonExp;
  id_gt?: IDComparisonExp;
  id_lt?: IDComparisonExp;
  id_gte?: IDComparisonExp;
  id_lte?: IDComparisonExp;
  id_in?: IDComparisonExp[];
  id_not_in?: IDComparisonExp[];

  address?: StringComparisonExp;
  address_not?: StringComparisonExp;
  address_gt?: StringComparisonExp;
  address_lt?: StringComparisonExp;
  address_gte?: StringComparisonExp;
  address_lte?: StringComparisonExp;
  address_in?: StringComparisonExp[];
  address_not_in?: StringComparisonExp[];
  address_contains?: string;
  address_contains_nocase?: string;
  address_not_contains?: string;
  address_not_contains_nocase?: string;
  address_starts_with?: string;
  address_starts_with_nocase?: string;
  address_not_starts_with?: string;
  address_not_starts_with_nocase?: string;
  address_ends_with?: string;
  address_ends_with_nocase?: string;
  address_not_ends_with?: string;
  address_not_ends_with_nocase?: string;

  prev?: StringComparisonExp;
  prev_not?: StringComparisonExp;
  prev_gt?: StringComparisonExp;
  prev_lt?: StringComparisonExp;
  prev_gte?: StringComparisonExp;
  prev_lte?: StringComparisonExp;
  prev_in?: StringComparisonExp[];
  prev_not_in?: StringComparisonExp[];
  prev_contains?: string;
  prev_contains_nocase?: string;
  prev_not_contains?: string;
  prev_not_contains_nocase?: string;
  prev_starts_with?: string;
  prev_starts_with_nocase?: string;
  prev_not_starts_with?: string;
  prev_not_starts_with_nocase?: string;
  prev_ends_with?: string;
  prev_ends_with_nocase?: string;
  prev_not_ends_with?: string;
  prev_not_ends_with_nocase?: string;

  key?: StringComparisonExp;
  key_not?: StringComparisonExp;
  key_gt?: StringComparisonExp;
  key_lt?: StringComparisonExp;
  key_gte?: StringComparisonExp;
  key_lte?: StringComparisonExp;
  key_in?: StringComparisonExp[];
  key_not_in?: StringComparisonExp[];
  key_contains?: string;
  key_contains_nocase?: string;
  key_not_contains?: string;
  key_not_contains_nocase?: string;
  key_starts_with?: string;
  key_starts_with_nocase?: string;
  key_not_starts_with?: string;
  key_not_starts_with_nocase?: string;
  key_ends_with?: string;
  key_ends_with_nocase?: string;
  key_not_ends_with?: string;
  key_not_ends_with_nocase?: string;

  votes?: BigIntComparisonExp;
  votes_not?: BigIntComparisonExp;
  votes_gt?: BigIntComparisonExp;
  votes_lt?: BigIntComparisonExp;
  votes_gte?: BigIntComparisonExp;
  votes_lte?: BigIntComparisonExp;
  votes_in?: BigIntComparisonExp[];
  votes_not_in?: BigIntComparisonExp[];

  pool?: StringComparisonExp;
  pool_not?: StringComparisonExp;
  pool_gt?: StringComparisonExp;
  pool_lt?: StringComparisonExp;
  pool_gte?: StringComparisonExp;
  pool_lte?: StringComparisonExp;
  pool_in?: StringComparisonExp[];
  pool_not_in?: StringComparisonExp[];
  pool_contains?: string;
  pool_contains_nocase?: string;
  pool_not_contains?: string;
  pool_not_contains_nocase?: string;
  pool_starts_with?: string;
  pool_starts_with_nocase?: string;
  pool_not_starts_with?: string;
  pool_not_starts_with_nocase?: string;
  pool_ends_with?: string;
  pool_ends_with_nocase?: string;
  pool_not_ends_with?: string;
  pool_not_ends_with_nocase?: string;

  commission?: BigIntComparisonExp;
  commission_not?: BigIntComparisonExp;
  commission_gt?: BigIntComparisonExp;
  commission_lt?: BigIntComparisonExp;
  commission_gte?: BigIntComparisonExp;
  commission_lte?: BigIntComparisonExp;
  commission_in?: BigIntComparisonExp[];
  commission_not_in?: BigIntComparisonExp[];

  assets?: BigIntComparisonExp;
  assets_not?: BigIntComparisonExp;
  assets_gt?: BigIntComparisonExp;
  assets_lt?: BigIntComparisonExp;
  assets_gte?: BigIntComparisonExp;
  assets_lte?: BigIntComparisonExp;
  assets_in?: BigIntComparisonExp[];
  assets_not_in?: BigIntComparisonExp[];

  reward?: BigIntComparisonExp;
  reward_not?: BigIntComparisonExp;
  reward_gt?: BigIntComparisonExp;
  reward_lt?: BigIntComparisonExp;
  reward_gte?: BigIntComparisonExp;
  reward_lte?: BigIntComparisonExp;
  reward_in?: BigIntComparisonExp[];
  reward_not_in?: BigIntComparisonExp[];

  inset?: IntComparisonExp;
  inset_not?: IntComparisonExp;
  inset_gt?: IntComparisonExp;
  inset_lt?: IntComparisonExp;
  inset_gte?: IntComparisonExp;
  inset_lte?: IntComparisonExp;
  inset_in?: IntComparisonExp[];
  inset_not_in?: IntComparisonExp[];

  blockNumber?: BigIntComparisonExp;
  blockNumber_not?: BigIntComparisonExp;
  blockNumber_gt?: BigIntComparisonExp;
  blockNumber_lt?: BigIntComparisonExp;
  blockNumber_gte?: BigIntComparisonExp;
  blockNumber_lte?: BigIntComparisonExp;
  blockNumber_in?: BigIntComparisonExp[];
  blockNumber_not_in?: BigIntComparisonExp[];

  logIndex?: BigIntComparisonExp;
  logIndex_not?: BigIntComparisonExp;
  logIndex_gt?: BigIntComparisonExp;
  logIndex_lt?: BigIntComparisonExp;
  logIndex_gte?: BigIntComparisonExp;
  logIndex_lte?: BigIntComparisonExp;
  logIndex_in?: BigIntComparisonExp[];
  logIndex_not_in?: BigIntComparisonExp[];

  blockTimestamp?: BigIntComparisonExp;
  blockTimestamp_not?: BigIntComparisonExp;
  blockTimestamp_gt?: BigIntComparisonExp;
  blockTimestamp_lt?: BigIntComparisonExp;
  blockTimestamp_gte?: BigIntComparisonExp;
  blockTimestamp_lte?: BigIntComparisonExp;
  blockTimestamp_in?: BigIntComparisonExp[];
  blockTimestamp_not_in?: BigIntComparisonExp[];

  _and?: CollatorSet_filter[];
  _or?: CollatorSet_filter[];
}

export interface CollatorSetQueryParams {
  skip?: number;
  first?: number;
  orderBy?: CollatorSetOrderByField;
  orderDirection?: OrderDirection;
  where?: CollatorSet_filter;
}

export type CollatorSetQueryFunction = (params: CollatorSetQueryParams) => Promise<CollatorSet[]>;

export type StakingAccountOrderByField = 'id' | 'pool' | 'collator' | 'account' | 'assets';
export interface StakingAccount {
  account: `0x${string}`;
  assets: string;
  collator: `0x${string}`;
  id: string;
  pool: string;
}

export interface StakingAccount_filter {
  id?: IDComparisonExp;
  id_not?: IDComparisonExp;
  id_gt?: IDComparisonExp;
  id_lt?: IDComparisonExp;
  id_gte?: IDComparisonExp;
  id_lte?: IDComparisonExp;
  id_in?: IDComparisonExp[];
  id_not_in?: IDComparisonExp[];

  pool?: StringComparisonExp;
  pool_not?: StringComparisonExp;
  pool_gt?: StringComparisonExp;
  pool_lt?: StringComparisonExp;
  pool_gte?: StringComparisonExp;
  pool_lte?: StringComparisonExp;
  pool_in?: StringComparisonExp[];
  pool_not_in?: StringComparisonExp[];
  pool_contains?: string;
  pool_contains_nocase?: string;
  pool_not_contains?: string;
  pool_not_contains_nocase?: string;
  pool_starts_with?: string;
  pool_starts_with_nocase?: string;
  pool_not_starts_with?: string;
  pool_not_starts_with_nocase?: string;
  pool_ends_with?: string;
  pool_ends_with_nocase?: string;
  pool_not_ends_with?: string;
  pool_not_ends_with_nocase?: string;

  collator?: StringComparisonExp;
  collator_not?: StringComparisonExp;
  collator_gt?: StringComparisonExp;
  collator_lt?: StringComparisonExp;
  collator_gte?: StringComparisonExp;
  collator_lte?: StringComparisonExp;
  collator_in?: StringComparisonExp[];
  collator_not_in?: StringComparisonExp[];
  collator_contains?: string;
  collator_contains_nocase?: string;
  collator_not_contains?: string;
  collator_not_contains_nocase?: string;
  collator_starts_with?: string;
  collator_starts_with_nocase?: string;
  collator_not_starts_with?: string;
  collator_not_starts_with_nocase?: string;
  collator_ends_with?: string;
  collator_ends_with_nocase?: string;
  collator_not_ends_with?: string;
  collator_not_ends_with_nocase?: string;

  account?: StringComparisonExp;
  account_not?: StringComparisonExp;
  account_gt?: StringComparisonExp;
  account_lt?: StringComparisonExp;
  account_gte?: StringComparisonExp;
  account_lte?: StringComparisonExp;
  account_in?: StringComparisonExp[];
  account_not_in?: StringComparisonExp[];
  account_contains?: string;
  account_contains_nocase?: string;
  account_not_contains?: string;
  account_not_contains_nocase?: string;
  account_starts_with?: string;
  account_starts_with_nocase?: string;
  account_not_starts_with?: string;
  account_not_starts_with_nocase?: string;
  account_ends_with?: string;
  account_ends_with_nocase?: string;
  account_not_ends_with?: string;
  account_not_ends_with_nocase?: string;

  assets?: BigIntComparisonExp;
  assets_not?: BigIntComparisonExp;
  assets_gt?: BigIntComparisonExp;
  assets_lt?: BigIntComparisonExp;
  assets_gte?: BigIntComparisonExp;
  assets_lte?: BigIntComparisonExp;
  assets_in?: BigIntComparisonExp[];
  assets_not_in?: BigIntComparisonExp[];

  _and?: StakingAccount_filter[];
  _or?: StakingAccount_filter[];
}

export interface StakingAccountQueryParams {
  skip?: number;
  first?: number;
  orderBy?: StakingAccountOrderByField;
  orderDirection?: OrderDirection;
  where?: StakingAccount_filter;
}
