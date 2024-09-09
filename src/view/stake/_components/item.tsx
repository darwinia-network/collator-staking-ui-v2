import { memo } from 'react';

import TooltipFormattedNumber from '@/components/tooltip-formatter-number';
import Avatar from '@/components/avatar';
import CollatorStatus from '@/components/collator-status';
import { toShortAddress } from '@/utils';
import { formatEther } from 'viem';
import type { StakingAccountWithStatus } from '@/hooks/useStakingAccountWithStatus';

interface ItemProps {
  item: StakingAccountWithStatus;
  onClick: () => void;
  style?: React.CSSProperties;
}
const Item = ({ item, onClick, style }: ItemProps) => {
  return (
    <div style={style}>
      <div className="flex h-[72px] w-full flex-col gap-[0.62rem] rounded-medium bg-secondary p-[0.62rem]">
        <div className="flex items-center justify-between text-[0.75rem] font-normal text-foreground/50">
          {item?.status && <CollatorStatus status={item?.status} />}

          <div
            className="cursor-pointer text-foreground/50 transition-opacity hover:opacity-[--nextui-hover-opacity]"
            onClick={onClick}
          >
            <img
              src="/images/common/setting.svg"
              alt="setting"
              className="block size-4 dark:hidden"
              loading="lazy"
            />
            <img
              src="/images/common/setting-dark.svg"
              alt="setting"
              className="hidden size-4 dark:block"
              loading="lazy"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.31rem]">
            <Avatar address={item?.collator || '0x'} />
            <span
              className="line-clamp-1 max-w-40 text-[0.875rem] font-bold text-foreground"
              title={item?.collator}
            >
              {toShortAddress(item?.collator) || ''}
            </span>
          </div>
          <TooltipFormattedNumber
            value={formatEther(BigInt(item?.assets))}
            interClassName="text-[0.875rem] text-foreground"
            decimalClassName="text-[0.875rem] text-foreground/50"
            zeroClassName="text-[0.875rem] text-foreground/50"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Item);
