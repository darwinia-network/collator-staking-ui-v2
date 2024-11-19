import { ChainId } from '@/types/chains';
import { nativeTokenIcon as crabNativeTokenIcon } from './crab';
import { nativeTokenIcon as darwiniaNativeTokenIcon } from './darwinia';

export { chain as crab, nativeTokenIcon as crabNativeTokenIcon } from './crab';
export { chain as darwinia, nativeTokenIcon as darwiniaNativeTokenIcon } from './darwinia';

export const KTON_TOKEN_MAP = new Map<ChainId, string>([
  [ChainId.CRAB, 'CKTON'],
  [ChainId.DARWINIA, 'KTON']
]);

export const NATIVE_TOKEN_ICON_MAP = new Map<ChainId, string>([
  [ChainId.CRAB, crabNativeTokenIcon],
  [ChainId.DARWINIA, darwiniaNativeTokenIcon]
]);

export const KTON_TOKEN_INFO_MAP = new Map<
  ChainId,
  { symbol: string; decimals: number; address: `0x${string}`; governanceName: string }
>([
  [
    ChainId.CRAB,
    {
      symbol: 'CKTON',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000402',
      governanceName: 'CktonDAO'
    }
  ],
  [
    ChainId.DARWINIA,
    {
      symbol: 'KTON',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000402',
      governanceName: 'KtonDAO'
    }
  ]
]);

export const RING_DAO_GOVERNANCE_MAP = new Map<
  ChainId,
  {
    url: string;
    name: string;
  }
>([
  [
    ChainId.CRAB,
    {
      url: "'http://crab-vote.ringdao.com'",
      name: 'CrabDAO governance'
    }
  ],
  [
    ChainId.DARWINIA,
    {
      url: "'http://vote.ringdao.com'",
      name: 'RingDAO governance'
    }
  ]
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
  ]
]);
