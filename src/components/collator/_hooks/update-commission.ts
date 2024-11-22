import { abi as hubAbi, address as hubAddress } from '@/config/abi/hub';
import { useReadContract, useWriteContract } from 'wagmi';
import { isNil } from 'lodash-es';
import { useCallback, useState } from 'react';
import { DEFAULT_PREV } from '@/utils/getPrevNew';
import { fetchCollatorSetNewPrev } from '@/hooks/useService';
import { genKey } from '@/utils';
import useWalletStatus from '@/hooks/useWalletStatus';

type UpdateCommissionProps = {
  newCommission: bigint;
  oldKey: string;
  collatorAddress: `0x${string}`;
  totalAssets: bigint;
};

const useUpdateCommission = ({
  newCommission,
  oldKey,
  collatorAddress,
  totalAssets
}: UpdateCommissionProps) => {
  const { currentChainId } = useWalletStatus();
  const [isLoadingNewPrev, setIsLoadingNewPrev] = useState(false);
  const { data: votes, isLoading: isLoadingVotes } = useReadContract({
    abi: hubAbi,
    address: hubAddress,
    functionName: 'assetsToVotes',
    args: [newCommission, totalAssets],
    query: {
      enabled: !isNil(totalAssets)
    }
  });

  const newKey = genKey({ address: collatorAddress, votes: (votes as bigint) ?? 0n });

  const { writeContractAsync, isPending } = useWriteContract();

  const updateCommission = useCallback(
    async ({ oldPrev }) => {
      if (!collatorAddress || !newKey || !oldKey) {
        return;
      }
      setIsLoadingNewPrev(true);
      const data = await fetchCollatorSetNewPrev({
        collatorAddress,
        newKey,
        currentChainId: currentChainId!
      });
      setIsLoadingNewPrev(false);
      const newPrev =
        data && data?.[0]?.address ? (data?.[0]?.address as `0x${string}`) : DEFAULT_PREV;

      return writeContractAsync({
        abi: hubAbi,
        address: hubAddress,
        functionName: 'updateCommission',
        args: [newCommission, oldPrev, newPrev]
      });
    },
    [newCommission, writeContractAsync, collatorAddress, newKey, oldKey, currentChainId]
  );

  return {
    updateCommission,
    isPending,
    votes,
    isLoading: isLoadingVotes || isLoadingNewPrev
  };
};

export default useUpdateCommission;
