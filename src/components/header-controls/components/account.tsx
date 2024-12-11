import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn
} from '@nextui-org/react';
import { ChevronDown, CopyIcon, LogOutIcon } from 'lucide-react';
import { useCopyToClipboard } from 'react-use';
import { useCallback, useState } from 'react';

import { toShortAddress } from '@/utils';
import { useDisconnectWallet } from '@/hooks/useDisconnectWallet';
import Avatar from '@/components/avatar';
import { success } from '@/components/toast';
import { GetEnsNameReturnType } from 'viem';

interface DesktopAccountProps {
  address: `0x${string}`;
  isMobile?: boolean;
  name?: GetEnsNameReturnType | undefined;
}

const DesktopAccount = ({ address, isMobile, name }: DesktopAccountProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [, copyToClipboard] = useCopyToClipboard();
  const { disconnectWallet } = useDisconnectWallet();

  const handleCopy = useCallback(() => {
    copyToClipboard(address);
    success('Address successfully copied to clipboard.');
  }, [address, copyToClipboard]);

  const handleDisconnect = useCallback(() => {
    disconnectWallet(address);
  }, [address, disconnectWallet]);

  return (
    <Dropdown
      onOpenChange={setIsOpen}
      backdrop="blur"
      placement={isMobile ? 'bottom-start' : 'bottom'}
      classNames={{
        content: 'rounded-medium text-foreground  bg-background'
      }}
    >
      <DropdownTrigger>
        <Button
          variant="flat"
          className="flex h-[2.25rem] w-full max-w-[13rem] flex-shrink-0 items-center justify-between gap-[0.31rem] rounded-small bg-background px-[0.62rem] md:w-auto md:min-w-0 md:max-w-none md:justify-start"
        >
          <div className="flex items-center gap-[0.31rem]">
            <Avatar address={address} />
            <span className="text-[0.875rem] font-normal text-foreground">
              {name ? name : toShortAddress(address)?.toUpperCase()}
            </span>
          </div>

          <ChevronDown
            size={16}
            strokeWidth={2}
            className={cn(
              'transform transition-transform',
              isOpen ? 'rotate-180' : 'rotate-0',
              'md:hidden'
            )}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="copy"
          startContent={<CopyIcon strokeWidth={2} size={16} />}
          onClick={handleCopy}
        >
          Copy address
        </DropdownItem>
        <DropdownItem
          key="disconnect"
          color="danger"
          startContent={<LogOutIcon strokeWidth={2} size={16} />}
          onClick={handleDisconnect}
        >
          Disconnect
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DesktopAccount;
