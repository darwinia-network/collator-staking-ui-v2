import { useCallback, useState } from 'react';
import { readContract } from '@wagmi/core';
import { abi as hubAbi, address as hubAddress } from '@/config/abi/hub';
import { fetchDeploymentMeta } from '@/service/services';
import { config } from '@/config/wagmi';
import { useWaitingIndexing } from '@/components/waiting-indexing/use-waiting-indexing';
import useWalletStatus from './useWalletStatus';

function useCheckWaitingIndexing() {
  const { currentChainId } = useWalletStatus();
  const { open, openError } = useWaitingIndexing();
  const [isLoading, setIsLoading] = useState(false);

  const checkWaitingIndexing = useCallback(async () => {
    if (!currentChainId) {
      return { isDeployed: false, error: new Error('ChainId is not set') };
    }
    setIsLoading(true);
    try {
      const [updateTimeStamp, deploymentMeta] = await Promise.all([
        readContract(config, {
          address: hubAddress,
          abi: hubAbi,
          functionName: 'updateTimeStamp'
        }),
        fetchDeploymentMeta(currentChainId)
      ]);
      if (!deploymentMeta?._meta?.block?.timestamp) {
        openError();
        setIsLoading(false);
        return { isDeployed: false, error: null };
      }
      if (deploymentMeta?._meta?.block?.timestamp) {
        const contractTimestamp = updateTimeStamp ? BigInt(updateTimeStamp.toString()) : 0n;
        const indexedTimestamp = BigInt(deploymentMeta._meta.block.timestamp);
        const isDeployed = contractTimestamp <= indexedTimestamp;
        if (!isDeployed) {
          open();
        }
        return { isDeployed, error: null };
      }

      return { isDeployed: false, error: new Error('Indexing service error') };
    } catch (error) {
      return {
        isDeployed: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    } finally {
      setIsLoading(false);
    }
  }, [currentChainId, open, openError]);

  return { checkWaitingIndexing, isLoading };
}

export default useCheckWaitingIndexing;
