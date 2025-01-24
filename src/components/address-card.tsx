import Avatar from '@/components/avatar';
import ClipboardIconButton from './clipboard-icon-button';
import { toShortAddress } from '@/utils';
import { useEffect, useState } from 'react';
import { resolveEnsName } from '@/utils/ensName';

interface AddressCardProps {
  address?: `0x${string}`;
  copyable?: boolean;
}

const ensCache = new Map<string, string>();
let currentRequestId = 0;
const failedRequests = new Set<string>();
const RETRY_DELAY = 1000; // 1 second delay

const AddressCard = ({ address, copyable = true }: AddressCardProps) => {
  const [ensName, setEnsName] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const getEnsName = async (connectedAddress: string): Promise<void> => {
    if (failedRequests.has(connectedAddress)) {
      setEnsName(undefined);
      return;
    }

    if (ensCache.has(connectedAddress)) {
      setEnsName(ensCache.get(connectedAddress));
      return;
    }

    const requestId = ++currentRequestId;
    setIsLoading(true);

    try {
      const name = await resolveEnsName(connectedAddress);
      if (requestId !== currentRequestId) return;

      if (name) {
        ensCache.set(connectedAddress, name);
        setEnsName(name);
      } else {
        setEnsName(undefined);
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        if (typeof error.message === 'string' && error.message.includes('429')) {
          failedRequests.add(connectedAddress);
          setEnsName(undefined);
          
          setTimeout(() => {
            failedRequests.delete(connectedAddress);
          }, RETRY_DELAY);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      getEnsName(address);
    }
  }, [address]);

  return (
    <div className="flex items-center gap-[0.31rem]">
      {address && <Avatar address={address} />}
      <span className="text-[0.875rem] text-foreground" title={address}>
        {isLoading ? '...' : (ensName || toShortAddress(address))}
      </span>
      {copyable && (
        <div>
          <ClipboardIconButton size={16} text={address} />
        </div>
      )}
    </div>
  );
};

export default AddressCard;
