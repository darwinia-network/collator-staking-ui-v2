import React from 'react';
import { Button } from '@nextui-org/react';

interface TransactionSuccessProps {
  title?: React.ReactNode;
  onOk?: () => void;
  isLoading?: boolean;
}
const TransactionSuccess = ({
  onOk,
  title = 'Transaction',
  isLoading
}: TransactionSuccessProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <img src="/images/common/success-icon.svg" alt="success-icon" className="size-20" />
      <div className="flex flex-col items-center justify-center gap-[0.62rem]">
        <p className="text-center text-[1.125rem] font-bold text-foreground">{title} Success!</p>
      </div>

      <div className="flex w-full flex-col gap-[0.62rem]">
        <Button color="primary" className="w-full" onClick={onOk} isLoading={isLoading}>
          Ok
        </Button>
      </div>
    </div>
  );
};

export default TransactionSuccess;
