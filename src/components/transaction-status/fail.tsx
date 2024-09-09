import React from 'react';
import { Button } from '@nextui-org/react';

interface TransactionFailProps {
  title?: React.ReactNode;
  onOk?: () => void;
}
const TransactionFail = ({ onOk, title = 'Transaction' }: TransactionFailProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <img src="/images/common/fail-icon.svg" alt="fail-icon" className="size-20" />
      <div className="flex flex-col items-center justify-center gap-[0.62rem]">
        <p className="text-center text-[1.125rem] font-bold text-foreground">{title} failed!</p>
      </div>

      <div className="flex w-full flex-col gap-[0.62rem]">
        <Button color="primary" className="w-full" onClick={onOk}>
          Ok
        </Button>
      </div>
    </div>
  );
};

export default TransactionFail;
