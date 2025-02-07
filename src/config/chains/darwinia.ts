import { ChainId } from '@/types/chains';

import type { Chain } from '@rainbow-me/rainbowkit';

export const chain: Chain = {
  id: ChainId.DARWINIA,
  name: 'Darwinia',
  nativeCurrency: {
    name: 'RING',
    symbol: 'RING',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.darwinia.network'],
      webSocket: ['wss://rpc.darwinia.network']
    },
    public: {
      http: ['https://rpc.darwinia.network'],
      webSocket: ['wss://rpc.darwinia.network']
    }
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://explorer.darwinia.network/'
    }
  },

  /**
   * rainbowkit iconUrl
   */
  iconUrl: '/images/chains/darwinia.png'
} as const satisfies Chain;

//native token icon
export const nativeTokenIcon = '/images/token/ring.svg';
