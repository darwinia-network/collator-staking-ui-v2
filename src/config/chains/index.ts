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
