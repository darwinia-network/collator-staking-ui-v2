import React, { ReactNode } from 'react';
import { cn, Tooltip } from '@nextui-org/react';
import { formatNumericValue } from '@/utils';

interface FormattedNumberTooltipProps {
  value: string;
  fractionDigits?: number;
  className?: string;
  children?: (formattedValue: string) => ReactNode;
}

const FormattedNumberTooltip = React.forwardRef<HTMLDivElement, FormattedNumberTooltipProps>(
  ({ value, fractionDigits = 3, className, children }, ref) => {
    const formattedValue = formatNumericValue(value, fractionDigits);
    const renderContent = children || ((formattedValue: string) => formattedValue);

    return (
      <Tooltip
        content={formattedValue.originalFormatNumberWithThousandsSeparator}
        showArrow
        color="default"
        closeDelay={0}
      >
        <div ref={ref} className={cn('cursor-pointer', className)}>
          {renderContent(formattedValue.formatted)}
        </div>
      </Tooltip>
    );
  }
);

FormattedNumberTooltip.displayName = 'FormattedNumberTooltip';

export default FormattedNumberTooltip;
