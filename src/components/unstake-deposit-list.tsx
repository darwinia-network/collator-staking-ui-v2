import { ScrollShadow } from '@nextui-org/react';
import UnstakeDepositItem from './unstake-deposit-item';
import useWalletStatus from '@/hooks/useWalletStatus';
import { useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import Empty from './empty';
import { StakedDepositInfo } from '@/view/stake/_hooks/staked';

export type DepositListRef = {
  reset: () => void;
};
interface DepositListProps {
  isDisabled?: boolean;
  maxCount?: number;
  deposits: StakedDepositInfo[];
  onCheckedDepositsChange: (deposits: StakedDepositInfo[]) => void;
}

const UnstakeDepositList = forwardRef<DepositListRef, DepositListProps>(
  ({ maxCount = 5, deposits, onCheckedDepositsChange, isDisabled = false }, ref) => {
    const [checkedDeposits, setCheckedDeposits] = useState<StakedDepositInfo[]>([]);

    const { chain } = useWalletStatus();

    const reset = useCallback(() => {
      setCheckedDeposits([]);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        reset
      }),
      [reset]
    );
    function handleDepositChange(deposit: StakedDepositInfo) {
      setCheckedDeposits((prevDeposits) =>
        prevDeposits.includes(deposit)
          ? prevDeposits.filter((prevDeposit) => prevDeposit.tokenId !== deposit.tokenId)
          : [...prevDeposits, deposit]
      );
    }

    useEffect(() => {
      onCheckedDepositsChange(checkedDeposits);
    }, [checkedDeposits, onCheckedDepositsChange]);

    const content = (
      <>
        {deposits?.length ? (
          deposits
            .slice(0, maxCount)
            .map((deposit) => (
              <UnstakeDepositItem
                key={deposit.tokenId}
                item={deposit}
                isDisabled={isDisabled}
                isChecked={checkedDeposits.includes(deposit)}
                symbol={chain?.nativeCurrency?.symbol}
                onChange={() => handleDepositChange(deposit)}
              />
            ))
        ) : (
          <Empty label="No active deposit records" />
        )}
      </>
    );

    if (!deposits || deposits.length <= maxCount) {
      return <div className="flex max-h-[20rem] w-full flex-col gap-5">{content}</div>;
    }
    return (
      <ScrollShadow hideScrollBar className="flex max-h-[20rem] w-full flex-col gap-5" size={20}>
        {content}
      </ScrollShadow>
    );
  }
);

export default UnstakeDepositList;
