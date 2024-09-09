import { useAccount } from 'wagmi';

import { getChainById, getChains } from '@/utils/chain';
import { KTON_TOKEN_INFO_MAP } from '@/config/chains';
import { ChainId } from '@/types/chains';

const chainIds = getChains().map((chain) => chain.id);

function useWalletStatus() {
  const result = useAccount();
  const isSupportedChain = result.chainId ? chainIds.includes(result.chainId) : false;
  const currentChainId = isSupportedChain ? result.chainId : undefined;
  const currentChain = currentChainId ? getChainById(currentChainId) : undefined;
  const ktonInfo =
    KTON_TOKEN_INFO_MAP.get(currentChainId as ChainId) ?? KTON_TOKEN_INFO_MAP.get(ChainId.DARWINIA);
  return {
    ...result,
    isSupportedChain,
    isEnabled: !!result.isConnected && isSupportedChain && !!result.address,
    currentChainId,
    currentChain,
    ktonInfo
  };
}

export default useWalletStatus;
