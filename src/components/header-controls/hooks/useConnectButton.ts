import { useState, useCallback } from 'react';
import { useAccount, useEnsName, useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import { getChainById } from '@/utils';

import type { ChainId } from '@/types/chains';

export function useConnectButton() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { chain, isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const activeChain = getChainById(chain?.id);
  const { switchChain } = useSwitchChain();

  const { data: name } = useEnsName({
    address,
    chainId: 1 // resolution always starts from L1
  });

  console.log('ens name', name);

  const handleChainChange = useCallback(
    (chainId: ChainId) => {
      switchChain({ chainId });
    },
    [switchChain]
  );

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return {
    isConnected,
    address,
    activeChain,
    openConnectModal,
    handleChainChange,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    name
  };
}
