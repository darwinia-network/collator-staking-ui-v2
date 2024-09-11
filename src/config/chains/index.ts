import { ChainId } from '@/types/chains';

export { chain as crab, nativeTokenIcon as crabNativeTokenIcon } from './crab';
export { chain as darwinia, nativeTokenIcon as darwiniaNativeTokenIcon } from './darwinia';
export { chain as koi, nativeTokenIcon as koiNativeTokenIcon } from './koi';

export const KTON_TOKEN_MAP = new Map<ChainId, string>([
  [ChainId.CRAB, 'CKTON'],
  [ChainId.DARWINIA, 'KTON'],
  [ChainId.KOI, 'PKTON']
]);

export const KTON_TOKEN_INFO_MAP = new Map<
  ChainId,
  { symbol: string; decimals: number; address: `0x${string}` }
>([
  [
    ChainId.CRAB,
    { symbol: 'CKTON', decimals: 18, address: '0x0000000000000000000000000000000000000402' }
  ],
  [
    ChainId.DARWINIA,
    { symbol: 'KTON', decimals: 18, address: '0x0000000000000000000000000000000000000402' }
  ],
  [
    ChainId.KOI,
    { symbol: 'PKTON', decimals: 18, address: '0x0000000000000000000000000000000000000402' }
  ]
]);

export const RING_DAO_GOVERNANCE_URL_MAP = new Map<ChainId, string>([
  [ChainId.CRAB, 'http://crab-vote.ringdao.com'],
  [ChainId.DARWINIA, 'http://vote.ringdao.com'],
  [ChainId.KOI, 'http://koi-vote.ringdao.com']
]);

export const GRING_TOKEN_ADDRESS_MAP = new Map<
  ChainId,
  {
    address: string;
    symbol: string;
    decimals: number;
  }
>([
  [
    ChainId.CRAB,
    {
      address: '0xdafa555e2785DC8834F4Ea9D1ED88B6049142999',
      symbol: 'gCRAB',
      decimals: 18
    }
  ],
  [
    ChainId.DARWINIA,
    {
      address: '0xdafa555e2785DC8834F4Ea9D1ED88B6049142999',
      symbol: 'gRING',
      decimals: 18
    }
  ],
  [
    ChainId.KOI,
    {
      address: '0xdafa555e2785DC8834F4Ea9D1ED88B6049142999',
      symbol: 'gKRING',
      decimals: 18
    }
  ]
]);
