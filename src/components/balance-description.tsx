import { BigNumber } from 'bignumber.js';
import { Spinner, Tooltip, cn } from '@nextui-org/react';

import { formatNumericValue } from '@/utils';

interface BalanceDescriptionProps {
  balance?: string;
  symbol?: string;
  text?: string;
  fractionDigits?: number;
  isLoading?: boolean;
}

const BalanceDescription = ({
  balance,
  symbol,
  isLoading,
  fractionDigits = 2,
  text = 'Balance'
}: BalanceDescriptionProps) => {
  const balanceBN = new BigNumber(balance || '0');

  if (!balanceBN.isFinite()) {
    return null;
  }

  const formattedBalance = formatNumericValue(balanceBN.toString(), fractionDigits);

  return (
    <div className="flex items-center gap-1 text-[0.75rem] font-normal text-foreground/50">
      <span>{text}:</span>
      {isLoading ? (
        <Spinner
          size="sm"
          classNames={{
            wrapper: cn('w-4 h-4')
          }}
        />
      ) : (
        <>
          <Tooltip
            content={formattedBalance.originalFormatNumberWithThousandsSeparator}
            showArrow
            color="default"
            closeDelay={0}
          >
            <span className="cursor-pointer">{formattedBalance.formatted}</span>
          </Tooltip>
          {symbol && <span>{symbol}</span>}
        </>
      )}
    </div>
  );
};

export default BalanceDescription;
