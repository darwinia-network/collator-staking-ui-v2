import React from 'react';
import { Tooltip } from '@nextui-org/tooltip';
import { cn } from '@nextui-org/react';

import { formatNumericValue } from '@/utils';

interface TooltipFormattedNumberProps {
  value: string;
  interClassName?: string;
  decimalClassName?: string;
  zeroClassName?: string;
}

const TooltipFormattedNumber: React.FC<TooltipFormattedNumberProps> = ({
  value,
  interClassName,
  decimalClassName,
  zeroClassName
}) => {
  if (value === '0') {
    return <p className={cn('m-0 text-[1.5rem] font-bold text-foreground/50', zeroClassName)}>0</p>;
  }

  const formattedValue = formatNumericValue(value);

  return (
    <Tooltip color="default" content={value} showArrow closeDelay={0}>
      <div className="flex items-center">
        <p className={cn('m-0 text-[1.5rem] font-bold text-primary-500', interClassName)}>
          {formattedValue.integerPart}
        </p>
        {formattedValue.decimalPart && (
          <p className={cn('m-0 text-[1.5rem] font-bold text-foreground/50', decimalClassName)}>
            .{formattedValue.decimalPart}
          </p>
        )}
      </div>
    </Tooltip>
  );
};

export default TooltipFormattedNumber;
