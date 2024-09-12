import { useReadContract } from 'wagmi';
import { address, abi } from '@/config/abi/collator';
import useWalletStatus from './useWalletStatus';

const useActiveCollators = ({ enabled }: { enabled: boolean }) => {
  const { isEnabled } = useWalletStatus();
  const result = useReadContract({
    address: address,
    abi: abi,
    functionName: 'getActiveCollators',
    args: [],
    query: {
      enabled: isEnabled && enabled
    }
  });

  return result;
};

export default useActiveCollators;
