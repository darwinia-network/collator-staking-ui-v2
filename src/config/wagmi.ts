import { cookieStorage, createStorage } from 'wagmi';
import { QueryClient } from '@tanstack/react-query';
import { getDefaultWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  talismanWallet,
  okxWallet,
  imTokenWallet,
  trustWallet,
  safeWallet
} from '@rainbow-me/rainbowkit/wallets';

import { getChains } from '@/utils/chain';
import { getBlockQueryOptions } from 'wagmi/query';

export const projectId = import.meta.env.VITE_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const { wallets } = getDefaultWallets();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 1_000,
      refetchOnMount: true,
      refetchOnWindowFocus: false
    }
  }
});

export async function fetchBlockData() {
  return queryClient.fetchQuery(
    getBlockQueryOptions(config, {
      chainId: config.state.chainId
    })
  );
}

export const config = getDefaultConfig({
  appName: import.meta.env.VITE_APP_NAME,
  projectId,
  wallets: [
    ...wallets,
    {
      groupName: 'More',
      wallets: [talismanWallet, okxWallet, imTokenWallet, trustWallet, safeWallet]
    }
  ],
  chains: getChains(),
  storage: createStorage({
    storage: cookieStorage
  })
});
