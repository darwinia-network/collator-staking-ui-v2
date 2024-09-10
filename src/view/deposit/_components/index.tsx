import { useCallback, useState, useMemo } from 'react';
import { Button, Select, SelectItem } from '@nextui-org/react';
import useWalletStatus from '@/hooks/useWalletStatus';
import useBalance from '@/hooks/useBalance';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import AmountInput from '@/components/amount-input-with-balance';
import TransactionStatus from '@/components/transaction-status';
import Rewards from './rewards';
import DepositRecordsModal from './records';
import useComputeInterest from '../_hooks/compute-interest';
import useDeposit from '../_hooks/deposit';

import type { SharedSelection } from '@nextui-org/react';

const terms = new Array(36).fill(0).map((_, index) => index + 1);

const Deposit = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const {
    value: amount,
    debouncedValue: debounceAmount,
    handleChange: handleAmountChange,
    reset: resetAmount
  } = useDebouncedState<string>({
    initialValue: '0',
    delay: 500
  });
  const [selectedMonthPeriod, setSelectedMonthPeriod] = useState<SharedSelection>(new Set());
  const { isEnabled, ktonInfo } = useWalletStatus();
  const { formatted, isLoading, data: balance, refetch: refetchBalance } = useBalance();
  const { handleDeposit, isPending: isPendingDeposit } = useDeposit();
  const computeInterest = useComputeInterest(debounceAmount, selectedMonthPeriod?.currentKey);

  const handleSelectionChange = useCallback((keys: SharedSelection) => {
    setSelectedMonthPeriod(keys as Set<string>);
  }, []);

  const handleConfirmDeposit = useCallback(async () => {
    const hash = await handleDeposit({
      months: selectedMonthPeriod?.currentKey,
      value: debounceAmount
    });
    setHash(hash);
  }, [handleDeposit, selectedMonthPeriod, debounceAmount]);

  const handleCloseTransactionStatus = useCallback(() => {
    setHash(undefined);
    resetAmount();
    setSelectedMonthPeriod(new Set());
    refetchBalance();
  }, [refetchBalance, resetAmount]);

  const isDisabledDeposit = useMemo(() => {
    return (
      !isEnabled ||
      !debounceAmount ||
      debounceAmount === '0' ||
      !selectedMonthPeriod?.currentKey ||
      computeInterest.isLoading
    );
  }, [isEnabled, debounceAmount, selectedMonthPeriod, computeInterest.isLoading]);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5">
        <AmountInput
          symbol={balance?.symbol}
          balance={formatted}
          isLoading={isLoading}
          value={amount}
          isDisabled={computeInterest.isLoading}
          onChange={handleAmountChange}
        />
        <Select
          label="Deposit term"
          placeholder="Select"
          className="w-full"
          isDisabled={!isEnabled || computeInterest.isLoading}
          selectedKeys={selectedMonthPeriod}
          onSelectionChange={handleSelectionChange}
          classNames={{
            trigger:
              'p-[0.62rem] h-[4.3125rem] bg-secondary hover:opacity-[var(--nextui-hover-opacity)] hover:bg-secondary transition-opacity',
            label: 'text-[0.75rem] font-normal text-foreground/50',
            value: 'text-[0.875rem] font-bold text-foreground',
            innerWrapper: 'pt-[1.56rem]',
            listbox: 'text-foreground'
          }}
        >
          {terms.map((term) => (
            <SelectItem
              key={term.toString()}
            >{`${term} ${term > 1 ? 'Months' : 'Month'}`}</SelectItem>
          ))}
        </Select>
        <Rewards
          symbol={ktonInfo?.symbol || ''}
          isLoading={computeInterest.isLoading}
          data={computeInterest.data || BigInt(0)}
        />
        <div className="w-full space-y-[0.62rem]">
          <Button
            className="w-full font-bold"
            color="primary"
            isLoading={isPendingDeposit}
            isDisabled={isDisabledDeposit}
            onClick={handleConfirmDeposit}
          >
            Deposit
          </Button>
          <Button
            className="w-full"
            color="primary"
            isDisabled={!isEnabled}
            variant="light"
            onClick={() => setIsOpen(true)}
          >
            Active Deposit
          </Button>
        </div>
      </div>
      <DepositRecordsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onRefreshRingBalance={refetchBalance}
      />
      <TransactionStatus hash={hash} title="Deposit" onSuccess={handleCloseTransactionStatus} />
    </>
  );
};

export default Deposit;
