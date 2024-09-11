import { useAccount } from 'wagmi';

import { getChainById, getChains } from '@/utils/chain';
import {
  GRING_TOKEN_ADDRESS_MAP,
  KTON_TOKEN_INFO_MAP,
  RING_DAO_GOVERNANCE_URL_MAP
} from '@/config/chains';
import { ChainId } from '@/types/chains';

const chainIds = getChains().map((chain) => chain.id);

function useWalletStatus() {
  const result = useAccount();
  const isSupportedChain = result.chainId ? chainIds.includes(result.chainId) : false;
  const currentChainId = isSupportedChain ? result.chainId : undefined;
  const currentChain = currentChainId ? getChainById(currentChainId) : undefined;
  const ktonInfo =
    KTON_TOKEN_INFO_MAP.get(currentChainId as ChainId) ?? KTON_TOKEN_INFO_MAP.get(ChainId.DARWINIA);

  const ringDAOGovernanceUrl = RING_DAO_GOVERNANCE_URL_MAP.get(currentChainId as ChainId);

  const gringTokenInfo = GRING_TOKEN_ADDRESS_MAP.get(currentChainId as ChainId);
  return {
    ...result,
    isSupportedChain,
    isEnabled: !!result.isConnected && isSupportedChain && !!result.address,
    currentChainId,
    currentChain,
    ktonInfo,
    ringDAOGovernanceUrl,
    gringTokenInfo
  };
}

export default useWalletStatus;
