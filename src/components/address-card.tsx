import Avatar from '@/components/avatar';
import { ethers } from 'ethers';
import ClipboardIconButton from './clipboard-icon-button';
import { toShortAddress } from '@/utils';
import { useEffect, useState } from 'react';
import { resolveEnsName } from '@/utils/ensName';

interface AddressCardProps {
  address?: `0x${string}`;
  copyable?: boolean;
}
const AddressCard = ({ address, copyable = true }: AddressCardProps) => {
  const [ensName, setEnsName] = useState<string | undefined>();
  const getEnsName = async (connectedAddress) => {
    const name = await resolveEnsName(connectedAddress);
    if (name) {
      console.log(`ENS name for ${connectedAddress}: ${name}`);
      setEnsName(name);
    } else {
      console.log('No ENS name available for this address.');
    }
  };

  useEffect(() => {
    if (address) {
      getEnsName(address.toString());
    }
  }, [address]);

  return (
    <div className="flex items-center gap-[0.31rem]">
      {address && <Avatar address={address} />}
      <span className="text-[0.875rem] text-foreground" title={address}>
        {ensName ? ensName : toShortAddress(address)}
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
