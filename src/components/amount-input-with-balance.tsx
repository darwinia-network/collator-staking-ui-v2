import React, { useCallback, useMemo } from 'react';
import { Button, cn } from '@nextui-org/react';
import { BigNumber } from 'bignumber.js';

import BalanceDescription from './balance-description';

interface AmountInputWithBalanceProps {
  symbol?: string;
  className?: string;
  balance?: string;
  isDisabled?: boolean;
  text?: string;
  isLoading?: boolean;
  fractionDigits?: number;
  value?: string;
  min?: string;
  max?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const AmountInputWithBalance = ({
  value,
  onChange,
  fractionDigits = 2,
  className,
  symbol,
  balance,
  text,
  isDisabled,
  isLoading,
  min = '0',
  max
}: AmountInputWithBalanceProps) => {
  const maxValue = useMemo(
    () => (max ? new BigNumber(max) : new BigNumber(balance || '0')),
    [max, balance]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) return;
      const newValue = e.target.value;
      const numValue = new BigNumber(newValue);

      if (newValue === '' || numValue.isNaN()) {
        onChange?.(e);
      } else {
        const minValue = new BigNumber(min);
        const result = BigNumber.max(BigNumber.min(numValue, maxValue), minValue);
        onChange?.({ target: { value: result.toString() } } as React.ChangeEvent<HTMLInputElement>);
      }
    },
    [onChange, min, maxValue, isDisabled]
  );

  const handleMaxClick = useCallback(() => {
    onChange?.({ target: { value: balance || '0' } } as React.ChangeEvent<HTMLInputElement>);
  }, [balance, onChange]);

  return (
    <div className={cn('flex w-full flex-col gap-[0.31rem]', className)}>
      <div className="relative flex flex-col gap-[0.69rem] rounded-medium bg-secondary p-[0.62rem] transition-opacity focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-secondary hover:opacity-[var(--nextui-hover-opacity)]">
        <div className="text-[0.75rem] font-normal text-foreground/50">Amount</div>
        <div className="relative flex h-6 items-center justify-between">
          <input
            value={value}
            type="number"
            placeholder="0"
            className="w-full appearance-none bg-transparent pr-16 text-[1rem] font-bold text-foreground placeholder:text-[0.875rem] placeholder:font-bold placeholder:text-[#c6c6c6] hover:bg-transparent focus-visible:outline-none"
            onChange={handleInputChange}
            step="any"
            disabled={isDisabled}
          />
          <Button
            color="primary"
            variant="flat"
            className="absolute right-0 z-10 h-[1.625rem] font-bold"
            size="sm"
            isDisabled={isDisabled}
            onClick={handleMaxClick}
          >
            Max
          </Button>
        </div>
      </div>
      <BalanceDescription
        balance={balance}
        symbol={symbol}
        text={text}
        isLoading={isLoading}
        fractionDigits={fractionDigits}
      />
    </div>
  );
};

export default AmountInputWithBalance;
