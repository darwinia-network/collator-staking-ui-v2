export enum CollatorSetSelectColumn {
  Address = 'address',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  ChainId = 'chainId',
  DbWriteTimestamp = 'db_write_timestamp',
  Id = 'id',
  LogIndex = 'logIndex',
  Prev = 'prev',
  Seq = 'seq',
  Votes = 'votes'
}

interface ComparisonExp<T> {
  _eq?: T;
  _gt?: T;
  _gte?: T;
  _in?: T[];
  _is_null?: boolean;
  _lt?: T;
  _lte?: T;
  _neq?: T;
  _nin?: T[];
}
interface TimestampComparisonExp {
  _eq?: Date;
  _gt?: Date;
  _gte?: Date;
  _in?: Date[];
  _is_null?: boolean;
  _lt?: Date;
  _lte?: Date;
  _neq?: Date;
  _nin?: Date[];
}

type IntComparisonExp = ComparisonExp<number>;
type NumericComparisonExp = ComparisonExp<number>;

export interface CollatorSetBoolExp {
  _and?: CollatorSetBoolExp[];
  _not?: CollatorSetBoolExp;
  _or?: CollatorSetBoolExp[];
  address?: StringComparisonExp;
  assets?: NumericComparisonExp;
  blockNumber?: NumericComparisonExp;
  blockTimestamp?: NumericComparisonExp;
  chainId?: NumericComparisonExp;
  commission?: NumericComparisonExp;
  db_write_timestamp?: TimestampComparisonExp;
  id?: StringComparisonExp;
  inset?: IntComparisonExp;
  logIndex?: IntComparisonExp;
  pool?: StringComparisonExp;
  prev?: StringComparisonExp;
  seq?: IntComparisonExp;
  votes?: NumericComparisonExp;
}

export type OrderByDirection =
  | 'asc'
  | 'desc'
  | 'asc_nulls_first'
  | 'asc_nulls_last'
  | 'desc_nulls_first'
  | 'desc_nulls_last';

export interface CollatorSetOrderBy {
  address?: OrderByDirection;
  assets?: OrderByDirection;
  blockNumber?: OrderByDirection;
  blockTimestamp?: OrderByDirection;
  chainId?: OrderByDirection;
  commission?: OrderByDirection;
  db_write_timestamp?: OrderByDirection;
  id?: OrderByDirection;
  inset?: OrderByDirection;
  logIndex?: OrderByDirection;
  pool?: OrderByDirection;
  prev?: OrderByDirection;
  seq?: OrderByDirection;
  votes?: OrderByDirection;
}

export interface CollatorSet {
  address: string;
  assets?: string;
  chainId: string;
  commission?: string;
  id: string;
  inset?: number;
  pool?: string;
  prev?: string;
  seq?: number;
  votes?: string;
  reward?: string;
}

export interface CollatorSetQueryParams {
  distinctOn?: CollatorSetSelectColumn[];
  limit?: number;
  offset?: number;
  orderBy?: CollatorSetOrderBy[];
  where?: CollatorSetBoolExp;
}

export type CollatorSetQueryFunction = (params: CollatorSetQueryParams) => Promise<CollatorSet[]>;

export enum StakingAccountSelectColumn {
  Account = 'account',
  Assets = 'assets',
  ChainId = 'chainId',
  Collator = 'collator',
  DbWriteTimestamp = 'db_write_timestamp',
  Id = 'id',
  Pool = 'pool'
}

export interface StakingAccountOrderBy {
  account?: OrderByDirection;
  assets?: OrderByDirection;
  chainId?: OrderByDirection;
  collator?: OrderByDirection;
  db_write_timestamp?: OrderByDirection;
  id?: OrderByDirection;
  pool?: OrderByDirection;
}

export interface StakingAccountBoolExp {
  _and?: StakingAccountBoolExp[];
  _not?: StakingAccountBoolExp;
  _or?: StakingAccountBoolExp[];
  account?: StringComparisonExp;
  assets?: NumericComparisonExp;
  chainId?: NumericComparisonExp;
  collator?: StringComparisonExp;
  db_write_timestamp?: TimestampComparisonExp;
  id?: StringComparisonExp;
  pool?: StringComparisonExp;
}

interface StringComparisonExp extends ComparisonExp<string> {
  _ilike?: string;
  _iregex?: string;
  _like?: string;
  _nilike?: string;
  _niregex?: string;
  _nlike?: string;
  _nregex?: string;
  _nsimilar?: string;
  _regex?: string;
  _similar?: string;
}

export interface StakingAccount {
  account: `0x${string}`;
  assets: string;
  chainId: string;
  collator: `0x${string}`;
  db_write_timestamp?: string;
  id: string;
  pool: string;
}

export interface StakingAccountQueryParams {
  distinct_on?: StakingAccountSelectColumn[];
  limit?: number;
  offset?: number;
  order_by?: StakingAccountOrderBy[];
  where?: StakingAccountBoolExp;
}
