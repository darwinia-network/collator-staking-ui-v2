import { useState } from 'react';
import { Button, cn } from '@nextui-org/react';

import useWalletStatus from '@/hooks/useWalletStatus';

import CollatorTabs from './collator-tabs';

interface CollatorProps {
  className?: string;
}
const Collator = ({ className }: CollatorProps) => {
  const { isEnabled } = useWalletStatus();
  const [isOpen, setIsOpen] = useState(false);

  return isEnabled ? (
    <>
      <Button
        variant="flat"
        size="sm"
        className={cn('flex items-center gap-[0.31rem]', className)}
        color="primary"
        onClick={() => setIsOpen(true)}
      >
        <img src="/images/common/collator.svg" alt="collator" className="size-4" />
        <span className="text-[0.875rem] font-normal text-primary">Join Collator</span>
      </Button>
      <CollatorTabs isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  ) : null;
};

export default Collator;
