import Avatar from '@/components/avatar';

import ClipboardIconButton from './clipboard-icon-button';
import { toShortAddress } from '@/utils';

interface AddressCardProps {
  address: `0x${string}`;
  copyable?: boolean;
}
const AddressCard = ({ address, copyable = true }: AddressCardProps) => {
  return (
    <div className="flex items-center gap-[0.31rem]">
      <Avatar address={address} />
      <span className="text-[0.875rem] text-foreground" title={address}>
        {toShortAddress(address)}
      </span>
      {copyable && <ClipboardIconButton size={16} text={address} />}
    </div>
  );
};

export default AddressCard;
