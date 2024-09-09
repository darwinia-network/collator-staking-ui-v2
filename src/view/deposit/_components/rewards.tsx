import { cn, Spinner } from '@nextui-org/react';
import { useMemo } from 'react';
import { formatEther } from 'viem';

import TooltipFormattedNumber from '@/components/tooltip-formatter-number';

interface RewardsProps {
  symbol: string;
  isLoading: boolean;
  data: bigint;
}
const Rewards = ({ symbol, isLoading, data }: RewardsProps) => {
  const formatted = useMemo(() => {
    return formatEther(data);
  }, [data]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-[0.625rem] rounded-medium bg-secondary p-[0.625rem] backdrop-blur-[20px]">
      <p className="m-0 text-[0.75rem] font-bold text-foreground/50">Reward you’ll receive</p>
      <div className="flex items-center gap-[0.625rem]">
        {isLoading ? (
          <Spinner
            size="sm"
            classNames={{
              wrapper: cn('w-4 h-4')
            }}
          />
        ) : (
          <TooltipFormattedNumber
            value={formatted}
            interClassName="text-success"
            decimalClassName="text-success/50"
          />
        )}
        <span className="text-[1.5rem] font-bold text-success">{symbol}</span>
      </div>
    </div>
  );
};

export default Rewards;
