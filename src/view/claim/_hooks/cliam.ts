import { address as hubAddress, abi as hubAbi } from '@/config/abi/hub';
import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';

const useClaim = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const claim = useCallback(
    async (collator: `0x${string}`) => {
      return await writeContractAsync({
        address: hubAddress as `0x${string}`,
        abi: hubAbi,
        functionName: 'claim',
        args: [collator]
      });
    },
    [writeContractAsync]
  );

  return { claim, ...rest };
};

export default useClaim;
