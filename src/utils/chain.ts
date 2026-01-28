import { darwinia } from '@/config/chains';
import { ChainId } from '@/types/chains';

import type { Chain } from '@rainbow-me/rainbowkit';

const chainConfigMap: Record<ChainId, Chain> = {
  [ChainId.DARWINIA]: darwinia
};

// Helper function to filter chains based on deployment mode
function filterChainsByDeploymentMode(chains: Record<ChainId, Chain>): Chain[] {
  // return Object.values(chains).filter((chain) =>
  //   chainDeployMode === 'mainnet' ? !chain.testnet : chain.testnet
  // );
  return Object.values(chains);
}

// Returns an array of all chain configurations, filtering based on deployment mode
export function getChains(): [Chain, ...Chain[]] {
  const filteredChains: Chain[] = filterChainsByDeploymentMode(chainConfigMap);
  if (filteredChains.length === 0) {
    throw new Error('No suitable chain configurations are available.');
  }
  return filteredChains as [Chain, ...Chain[]];
}

// Returns the chain by its id
export function getChainById(id?: ChainId): Chain | undefined {
  return id ? chainConfigMap[id] : undefined;
}

// Returns the default chain configuration based on deployment mode
export function getDefaultChain(): Chain {
  const filteredChains = filterChainsByDeploymentMode(chainConfigMap);
  if (filteredChains.length === 0) {
    throw new Error(
      'No suitable chain configurations are available for the current deployment mode.'
    );
  }

  const defaultChainId = ChainId.DARWINIA;
  const defaultChain = filteredChains.find((chain) => chain.id === defaultChainId);

  return defaultChain || filteredChains[0];
}

// Returns the default chain id based on the default chain
export function getDefaultChainId(): ChainId {
  const defaultChain = getDefaultChain();
  return defaultChain.id;
}

// return if the chain is supported
export function isSupportedChain(chainId: ChainId): boolean {
  const filteredChains = filterChainsByDeploymentMode(chainConfigMap);
  return filteredChains.some((chain) => chain.id === chainId);
}
