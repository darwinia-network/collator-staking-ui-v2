import { useReadContract } from 'wagmi';
import { address, abi } from '@/config/abi/palletHelper';

const useActiveCollatorCount = ({ enabled }: { enabled: boolean }) => {
  const result = useReadContract({
    address: address,
    abi: abi,
    functionName: 'getContractCollators',
    args: [],
    query: {
      enabled
    }
  });

  return result;
};

export default useActiveCollatorCount;
