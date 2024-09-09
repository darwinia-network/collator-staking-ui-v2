import { ChainId } from '@/types/chains';

import type { Chain } from '@rainbow-me/rainbowkit';

export const chain: Chain = {
  id: ChainId.KOI,
  name: 'Koi',
  nativeCurrency: {
    name: 'KRING',
    symbol: 'KRING',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://koi-rpc.darwinia.network'],
      webSocket: ['wss://koi-rpc.darwinia.network']
    },
    public: {
      http: ['https://koi-rpc.darwinia.network'],
      webSocket: ['wss://koi-rpc.darwinia.network']
    }
  },
  blockExplorers: {
    default: {
      name: 'Koi Scan',
      url: 'https://koi-scan.darwinia.network/'
    }
  },
  testnet: true,

  /**
   * rainbowkit iconUrl
   */
  iconUrl: '/images/chains/koi.svg'
} as const satisfies Chain;

// native token icon
export const nativeTokenIcon = '/images/token/ring.svg';
