import { ChainId } from '@/types/chains';

import type { Chain } from '@rainbow-me/rainbowkit';

export const chain: Chain = {
  id: ChainId.CRAB,
  name: 'Crab',
  nativeCurrency: {
    name: 'CRAB',
    symbol: 'CRAB',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://crab-rpc.darwinia.network'],
      webSocket: ['wss://crab-rpc.darwinia.network']
    },
    public: {
      http: ['https://crab-rpc.darwinia.network'],
      webSocket: ['wss://crab-rpc.darwinia.network']
    }
  },
  blockExplorers: {
    default: {
      name: 'CrabExplorer',
      url: 'https://crab-scan.darwinia.network'
    }
  },

  /**
   * rainbowkit iconUrl
   */
  iconUrl: '/images/chains/crab.svg'
} as const satisfies Chain;

//native token icon
export const nativeTokenIcon = '/images/token/crab.svg';
