import { abi as hubAbi, address as hubAddress } from '@/config/abi/hub';
import { useReadContract, useWriteContract } from 'wagmi';
import { isNil } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { determineOldAndNewPrev } from '@/utils/getPrevNew';
import type { CollatorSet } from '@/service/type';
import { useCollatorByAddress } from '@/hooks/useService';
import useWalletStatus from '@/hooks/useWalletStatus';

type UpdateCommissionProps = {
  collatorList: CollatorSet[];
  newCommission: bigint;
};

const useUpdateCommission = ({ collatorList, newCommission }: UpdateCommissionProps) => {
  const { address, currentChainId } = useWalletStatus();
  const { data: collatorByAddress, isLoading: isLoadingCollatorByAddress } = useCollatorByAddress({
    currentChainId,
    address: address as `0x${string}`,
    enabled: true
  });

  const totalAssets = useMemo(() => {
    const assets = collatorByAddress?.[0]?.assets;
    return assets ? BigInt(assets) : BigInt(0);
  }, [collatorByAddress]);

  const { data: votes, isLoading: isLoadingVotes } = useReadContract({
    abi: hubAbi,
    address: hubAddress,
    functionName: 'assetsToVotes',
    args: [totalAssets, newCommission],
    query: {
      enabled: !!newCommission && !isNil(totalAssets)
    }
  });

  const { oldPrev, newPrev } = determineOldAndNewPrev({
    collatorList,
    collator: address as `0x${string}`,
    newVotes: votes || BigInt(0)
  });

  const { writeContractAsync, isPending } = useWriteContract();

  const updateCommission = useCallback(async () => {
    return writeContractAsync({
      abi: hubAbi,
      address: hubAddress,
      functionName: 'updateCommission',
      args: [newCommission, oldPrev, newPrev]
    });
  }, [newCommission, oldPrev, newPrev, writeContractAsync]);

  return {
    updateCommission,
    isPending,
    votes,
    isLoading: isLoadingVotes || isLoadingCollatorByAddress
  };
};

export default useUpdateCommission;
