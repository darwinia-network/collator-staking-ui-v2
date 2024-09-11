import { useReadContract } from 'wagmi';
import { address, abi } from '@/config/abi/collator';

const useActiveCollators = ({ enabled }: { enabled: boolean }) => {
  const result = useReadContract({
    address: address,
    abi: abi,
    functionName: 'getActiveCollators',
    args: [],
    query: {
      enabled
    }
  });

  return result;
};

export default useActiveCollators;
