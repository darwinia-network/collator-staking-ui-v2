import { address, abi } from '@/config/abi/hub';
import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';

type CreateAndCollatorProps = {
  prev: `0x${string}`;
  commission: bigint;
};
export const useCreateAndCollator = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const createAndCollator = useCallback(
    async ({ prev, commission }: CreateAndCollatorProps) => {
      return await writeContractAsync({
        address,
        abi,
        functionName: 'createAndCollate',
        args: [prev, commission]
      });
    },
    [writeContractAsync]
  );

  return { createAndCollator, ...rest };
};

export default useCreateAndCollator;

export const useCreateCollator = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const createCollator = useCallback(
    async ({ prev, commission }: CreateAndCollatorProps) => {
      return await writeContractAsync({
        address,
        abi,
        functionName: 'collate',
        args: [prev, commission]
      });
    },
    [writeContractAsync]
  );

  return { createCollator, ...rest };
};
