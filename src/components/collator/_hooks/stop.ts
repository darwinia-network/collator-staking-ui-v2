import { abi, address as hubAddress } from '@/config/abi/hub';
import { useWriteContract } from 'wagmi';

const useStop = () => {
  const { writeContractAsync, isPending } = useWriteContract();

  const stop = async ({ address }: { address: `0x${string}` }) => {
    return writeContractAsync({
      address: hubAddress,
      abi,
      functionName: 'stopCollation',
      args: [address]
    });
  };

  return { stop, isPending };
};

export default useStop;
