import { useCallback, useState } from 'react';
import { parseEther } from 'viem';
import { Button, Divider, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { X } from 'lucide-react';
import AmountInputWithBalance from '@/components/amount-input-with-balance';
import TransactionStatus from '@/components/transaction-status';
import { error } from '@/components/toast';
import { useUnstakeRING, useUnstakeRINGFromInactiveCollator } from '../../_hooks/unstake';
import useCheckWaitingIndexing from '@/hooks/useWaitingIndexing';
import type { CollatorSet } from '@/service/type';

interface EditStakeProps {
  isOpen: boolean;
  symbol: string;
  isInactive: boolean;
  collator?: CollatorSet;
  totalAmount: string;
  onClose: () => void;
  onOk: () => void;
}

const Unstake = ({
  isOpen,
  isInactive,
  symbol,
  collator,
  totalAmount,
  onClose,
  onOk
}: EditStakeProps) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [amount, setAmount] = useState<string>('0');
  const { checkWaitingIndexing, isLoading: isLoadingWaitingIndexing } = useCheckWaitingIndexing();
  const { unstakeRING, isPending, isLoadingOldAndNewPrev } = useUnstakeRING({
    collator,
    inputAmount: parseEther(amount)
  });
  const { unstakeRINGFromInactiveCollator, isPending: isPendingFromInactiveCollator } =
    useUnstakeRINGFromInactiveCollator({
      collator,
      inputAmount: parseEther(amount)
    });

  const handleUnstake = useCallback(async () => {
    const { isDeployed } = await checkWaitingIndexing();
    if (!isDeployed) {
      return;
    }
    let tx;
    if (isInactive) {
      tx = await unstakeRINGFromInactiveCollator()?.catch((e) => {
        error(e.shortMessage);
      });
    } else {
      tx = await unstakeRING()?.catch((e) => {
        error(e.shortMessage);
      });
    }
    if (tx) {
      setHash(tx);
    }
  }, [checkWaitingIndexing, unstakeRING, unstakeRINGFromInactiveCollator, isInactive]);

  const handleFail = useCallback(() => {
    setHash(undefined);
  }, []);

  const handleSuccess = useCallback(() => {
    setHash(undefined);
    setAmount('0');
    onOk?.();
  }, [onOk]);
  return (
    <>
      <Modal
        placement="center"
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        classNames={{
          closeButton:
            'p-0 top-[1.35rem] right-[1.35rem] hover:opacity-[var(--nextui-hover-opacity)] hover:bg-transparent'
        }}
        className="bg-background"
        closeButton={<X strokeWidth={1.5} />}
      >
        <ModalContent className="w-[calc(100vw-1.24rem)] px-5 py-0 md:w-[25rem]">
          <ModalHeader className="px-0 py-5 text-[1.125rem] text-foreground">Unstake</ModalHeader>

          <Divider />
          <ModalBody className="flex w-full flex-col items-center justify-center gap-5 px-0 py-5">
            <AmountInputWithBalance
              className="w-full"
              symbol={symbol}
              balance={totalAmount}
              text="Staking"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Divider />
            <Button
              color="primary"
              className="w-full"
              isDisabled={amount === '0'}
              isLoading={
                isPending ||
                isPendingFromInactiveCollator ||
                isLoadingOldAndNewPrev ||
                isLoadingWaitingIndexing
              }
              onClick={handleUnstake}
            >
              Unstake
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <TransactionStatus
        hash={hash}
        onFail={handleFail}
        onSuccess={handleSuccess}
        title="Unstake"
      />
    </>
  );
};

export default Unstake;
