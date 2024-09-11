import { useReadContract } from 'wagmi';
import { address, abi } from '@/config/abi/collator';

const useActiveCollators = ({ enabled }: { enabled: boolean }) => {
  const result = useReadContract({
    address: address,
    abi: abi,
    functionName: 'getActiveCollators',
    args: [],
    query: {
      enabled,
      refetchOnMount: true,
      staleTime: 0
    }
  });

  return result;
};

export default useActiveCollators;
