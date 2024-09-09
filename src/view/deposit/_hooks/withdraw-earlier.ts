import { useWriteContract } from 'wagmi';
import { address, abi } from '@/config/abi/deposit';

export const useWithdrawEarlier = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const withdrawEarlier = async (tokenId: bigint) => {
    return await writeContractAsync({
      address,
      abi,
      functionName: 'claimWithPenalty',
      args: [tokenId]
    });
  };

  return { withdrawEarlier, ...rest };
};
