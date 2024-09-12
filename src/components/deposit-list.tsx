import { ScrollShadow, Skeleton } from '@nextui-org/react';
import DepositItem from './deposit-item';
import { DepositInfo, useUserDepositDetails } from '@/hooks/useUserDepositDetails';
import useWalletStatus from '@/hooks/useWalletStatus';
import { useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import Empty from './empty';

const Loading = () => {
  return (
    <>
      <Skeleton className="h-8 w-full rounded-medium" />
      <Skeleton className="h-8 w-full rounded-medium" />
      <Skeleton className="h-8 w-full rounded-medium" />
      <Skeleton className="h-8 w-full rounded-medium" />
      <Skeleton className="h-8 w-full rounded-medium" />
    </>
  );
};

export type DepositListRef = {
  refetch: () => void;
  resetAndRefetch: () => void;
};
interface DepositListProps {
  maxCount?: number;
  onCheckedDepositsChange: (deposits: DepositInfo[]) => void;
}

const DepositList = forwardRef<DepositListRef, DepositListProps>(
  ({ maxCount = 5, onCheckedDepositsChange }, ref) => {
    const [checkedDeposits, setCheckedDeposits] = useState<DepositInfo[]>([]);

    const { chain } = useWalletStatus();
    const {
      depositList,
      isLoading: isDepositListLoading,
      refetch
    } = useUserDepositDetails({
      enabled: true
    });

    const resetAndRefetch = useCallback(() => {
      setCheckedDeposits([]);
      refetch();
    }, [refetch]);

    const handleDepositChange = useCallback((deposit: DepositInfo) => {
      setCheckedDeposits((prevDeposits) =>
        prevDeposits.includes(deposit)
          ? prevDeposits.filter((prevDeposit) => prevDeposit.tokenId !== deposit.tokenId)
          : [...prevDeposits, deposit]
      );
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        refetch,
        resetAndRefetch
      }),
      [refetch, resetAndRefetch]
    );

    useEffect(() => {
      onCheckedDepositsChange(checkedDeposits);
    }, [checkedDeposits, onCheckedDepositsChange]);

    const content = (
      <>
        {isDepositListLoading ? (
          <Loading />
        ) : depositList?.length ? (
          depositList
            .slice(0, maxCount)
            .map((deposit) => (
              <DepositItem
                key={deposit.tokenId}
                item={deposit}
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

    if (!depositList || depositList.length <= maxCount) {
      return <div className="flex max-h-[20rem] w-full flex-col gap-5">{content}</div>;
    }
    return (
      <ScrollShadow hideScrollBar className="flex max-h-[20rem] w-full flex-col gap-5" size={20}>
        {content}
      </ScrollShadow>
    );
  }
);

export default DepositList;
