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
const failedRequests = new Set<string>(); // Track failed requests
let currentRequestId = 0;
const RETRY_DELAY = 1000; // 1 second delay between retries

const AddressCard = ({ address, copyable = true }: AddressCardProps) => {
  const [ensName, setEnsName] = useState<string | undefined>();

  const getEnsName = async (connectedAddress: string): Promise<void> => {
    // Don't retry failed requests immediately
    if (failedRequests.has(connectedAddress)) {
      setEnsName('noName');
      return;
    }

    if (ensCache.has(connectedAddress)) {
      setEnsName(ensCache.get(connectedAddress));
      return;
    }

    const requestId = ++currentRequestId;

    try {
      const name = await resolveEnsName(connectedAddress);
      if (requestId !== currentRequestId) return;

      const resolvedName = name || 'noName';
      ensCache.set(connectedAddress, resolvedName);
      setEnsName(resolvedName);
    } catch (error) {
      if (error.message.includes('429')) {
        // Rate limit exceeded
        failedRequests.add(connectedAddress);
        setEnsName('noName');
        
        // Retry after delay
        setTimeout(() => {
          failedRequests.delete(connectedAddress);
        }, RETRY_DELAY);
      }
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
        {toShortAddress(address)}
        {ensName ? (ensName === 'noName' ? toShortAddress(address) : ensName) : '...'}
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
