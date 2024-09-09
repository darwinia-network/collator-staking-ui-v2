import { useState, useCallback } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import { getChainById } from '@/utils';

import type { ChainId } from '@/types/chains';

export function useConnectButton() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { chain, isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const activeChain = getChainById(chain?.id);
  const { switchChain } = useSwitchChain();

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
    closeDrawer
  };
}
