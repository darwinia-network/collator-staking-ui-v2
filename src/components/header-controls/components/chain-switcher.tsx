import { useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn
} from '@nextui-org/react';
import { ChevronDown } from 'lucide-react';

import { getChains } from '@/utils';

import type { Chain } from '@rainbow-me/rainbowkit';
import { ChainId } from '@/types/chains';

interface ChainSwitcherProps {
  activeChain: Chain;
  onChainChange?: (chainId: ChainId) => void;
  isMobile?: boolean;
}

const chains = getChains();
const DesktopChainSwitcher = ({ activeChain, onChainChange, isMobile }: ChainSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown
      backdrop="blur"
      onOpenChange={setIsOpen}
      placement={isMobile ? 'bottom-start' : 'bottom'}
      classNames={{
        content: 'rounded-medium min-w-[8rem] text-foreground bg-background'
      }}
    >
      <DropdownTrigger>
        <Button
          variant="flat"
          className="flex h-[2.25rem] w-full max-w-[13rem] flex-shrink-0 items-center justify-between gap-[0.31rem] rounded-small bg-background px-[0.62rem] md:w-auto md:min-w-0 md:justify-start"
        >
          <div className="flex items-center gap-[0.31rem]">
            <img
              src={activeChain.iconUrl as string}
              loading="eager"
              className="size-[1.5rem] rounded-full"
              alt={activeChain.name}
            />
            <span className="inline text-[0.875rem] font-normal text-foreground md:hidden">
              {activeChain.name}
            </span>
          </div>

          <ChevronDown
            size={16}
            strokeWidth={2}
            className={cn('transform transition-transform', isOpen ? 'rotate-180' : 'rotate-0')}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        selectedKeys={[String(activeChain.id)]}
        selectionMode="single"
        onSelectionChange={(keys) => {
          onChainChange?.(Number(keys.currentKey) as ChainId);
        }}
      >
        {chains.map((chain) => (
          <DropdownItem
            key={String(chain.id)}
            textValue={chain.name}
            startContent={
              <img
                src={chain.iconUrl as string}
                loading="eager"
                className="h-[1.5rem] w-[1.5rem] rounded-full"
                alt={chain.name}
              />
            }
          >
            <span className="text-[0.875rem] font-light leading-6">{chain.name}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DesktopChainSwitcher;
