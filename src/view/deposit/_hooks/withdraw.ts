import { useWriteContract } from 'wagmi';
import { address, abi } from '@/config/abi/deposit';

export const useWithdraw = () => {
  const { writeContractAsync, ...rest } = useWriteContract();

  const withdraw = async (tokenId: bigint) => {
    return await writeContractAsync({
      address,
      abi,
      functionName: 'claim',
      args: [tokenId]
    });
  };

  return { withdraw, ...rest };
};
