import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  cn,
  Tab,
  Tabs,
  Divider,
  Spinner
} from '@nextui-org/react';
import { ChevronDown, X } from 'lucide-react';
import { parseEther } from 'viem';

import { TransitionPanel } from '@/components/transition-panel';
import TransactionStatus from '@/components/transaction-status';
import { stakeTabs } from '@/config/tabs';

import StakeRing, { StakeRingRef } from './stake-ring';
import StakeDeposit from './stake-deposit';
import SelectCollator from './collator-selection-modal';

import Avatar from '@/components/avatar';
import { toShortAddress } from '@/utils';
import { DepositInfo } from '@/hooks/useUserDepositDetails';
import type { DepositListRef } from '@/components/deposit-list';
import {
  useIsApprovedForAll,
  useApprovalForAll,
  useDepositStake,
  useRingStake
} from '../../_hooks/stake';

import type { Key } from '@/types/ui';
import useDebounceState from '@/hooks/useDebounceState';
import { useCollatorByAddress } from '@/hooks/useService';
import useWalletStatus from '@/hooks/useWalletStatus';

interface NewStakeModalProps {
  onClose: () => void;
  onSuccess: () => void;
  isOpen?: boolean;
}
const NewStakeModal = ({ onClose, isOpen, onSuccess }: NewStakeModalProps) => {
  const { currentChainId } = useWalletStatus();
  const stakeRingRef = useRef<StakeRingRef>(null);
  const depositListRef = useRef<DepositListRef>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>(undefined);
  const [, debouncedAmount, setAmount] = useDebounceState<string | undefined>('0');
  const [selected, setSelected] = useState<Key>(stakeTabs[0].key);
  const [selectedCollatorAddress, setSelectedCollatorAddress] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [selectCollatorOpen, setSelectCollatorOpen] = useState(false);
  const [checkedDeposits, setCheckedDeposits] = useState<DepositInfo[]>([]);

  const {
    data: collators,
    isLoading: isCollatorLoading,
    refetch: refetchCollator
  } = useCollatorByAddress({
    currentChainId: currentChainId,
    address: selectedCollatorAddress!,
    enabled: !!selectedCollatorAddress
  });

  useEffect(() => {
    if (selectedCollatorAddress) {
      refetchCollator();
    }
  }, [selectedCollatorAddress, refetchCollator]);

  const collator = useMemo(() => {
    return collators?.[0];
  }, [collators]);

  const {
    data: isApprovedForAll,
    isLoading: isLoadingIsApprovedForAll,
    refetch: refetchIsApprovedForAll
  } = useIsApprovedForAll();

  const {
    handleStake: handleRingStake,
    isLoadingOldAndNewPrev: isLoadingOldAndNewPrevRing,
    isPending: isPendingRingStake
  } = useRingStake({
    collator,
    assets: !!debouncedAmount && debouncedAmount !== '0' ? parseEther(debouncedAmount) : 0n
  });

  const { handleApprovalForAll, isPending: isPendingApprovalForAll } = useApprovalForAll();

  const {
    handleStake: handleDepositStake,
    isLoadingOldAndNewPrev: isLoadingOldAndNewPrevDeposit,
    isPending: isPendingDepositStake
  } = useDepositStake({
    collator,
    deposits: checkedDeposits
  });

  const handleAmountChange = useCallback(
    (amount: string) => {
      setAmount(amount);
    },
    [setAmount]
  );

  const handleTabChange = useCallback((key: Key) => {
    setSelected(key);
  }, []);

  const handleSelectionChange = useCallback((address: `0x${string}`) => {
    setSelectedCollatorAddress(address);
    if (address) {
      setSelectCollatorOpen(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectCollatorOpen(false);
  }, []);

  const handleDepositStakeStart = useCallback(async () => {
    refetchIsApprovedForAll();
    const tx = await handleDepositStake();
    if (tx) {
      setApprovalHash(undefined);
      setHash(tx);
    }
  }, [handleDepositStake, refetchIsApprovedForAll]);

  const handleStake = useCallback(async () => {
    if (selected === 'stake-ring') {
      const tx = await handleRingStake();
      if (tx) {
        setHash(tx);
      }
    } else if (selected === 'stake-deposit') {
      if (!isApprovedForAll) {
        const tx = await handleApprovalForAll();
        if (tx) {
          setApprovalHash(tx);
        }
      } else {
        const tx = await handleDepositStake();
        if (tx) {
          setHash(tx);
        }
      }
    }
  }, [selected, handleRingStake, handleApprovalForAll, isApprovedForAll, handleDepositStake]);

  const handleTransactionSuccess = useCallback(() => {
    if (selected === 'stake-ring') {
      stakeRingRef.current?.resetBalanceAndAmount();
      setAmount('0');
    } else if (selected === 'stake-deposit') {
      depositListRef.current?.resetAndRefetch();
      setCheckedDeposits([]);
    }
    setHash(undefined);
    onSuccess();
  }, [selected, setAmount, onSuccess]);

  const handleTransactionFail = useCallback(() => {
    setHash(undefined);
  }, []);

  // isDisabled 需要根据 selected 和 amount 来决定,每一种都是不一样的
  const isDisabled = useMemo(() => {
    if (!selectedCollatorAddress) {
      return true;
    }
    if (selected === 'stake-ring') {
      return debouncedAmount === '0';
    } else if (selected === 'stake-deposit') {
      return checkedDeposits.length === 0;
    }
    return false;
  }, [selected, debouncedAmount, checkedDeposits, selectedCollatorAddress]);

  const isPending = useMemo(() => {
    if (selected === 'stake-ring') {
      return isLoadingOldAndNewPrevRing || isPendingRingStake || isCollatorLoading;
    } else if (selected === 'stake-deposit') {
      if (!isApprovedForAll) {
        return (
          isLoadingOldAndNewPrevDeposit ||
          isLoadingIsApprovedForAll ||
          isPendingApprovalForAll ||
          isCollatorLoading
        );
      } else {
        return (
          isLoadingOldAndNewPrevDeposit ||
          isLoadingIsApprovedForAll ||
          isPendingDepositStake ||
          isCollatorLoading
        );
      }
    }
    return false;
  }, [
    isLoadingOldAndNewPrevRing,
    isPendingRingStake,
    isPendingApprovalForAll,
    isLoadingOldAndNewPrevDeposit,
    selected,
    isLoadingIsApprovedForAll,
    isApprovedForAll,
    isPendingDepositStake,
    isCollatorLoading
  ]);

  const buttonText = useMemo(() => {
    if (selected === 'stake-deposit' && !isApprovedForAll) {
      return 'Approve';
    }
    return 'Staking';
  }, [selected, isApprovedForAll]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCollatorAddress(undefined);
      setAmount('0');
      setCheckedDeposits([]);
    }
  }, [isOpen, setAmount]);

  return (
    <>
      <Modal
        placement="center"
        backdrop="blur"
        isDismissable={false}
        isOpen={isOpen}
        onClose={onClose}
        className="bg-background"
        classNames={{
          closeButton:
            'p-0 top-[1.35rem] right-[1.35rem] hover:opacity-[var(--nextui-hover-opacity)] hover:bg-transparent'
        }}
        closeButton={<X strokeWidth={1.5} />}
      >
        <ModalContent className="w-[calc(100vw-1.24rem)] gap-5 md:w-[25rem]">
          <ModalHeader className="px-5 pb-0 pt-5 text-[1.125rem] font-bold text-foreground">
            <span>New Stake</span>
          </ModalHeader>
          <div className="px-5">
            <Divider />
          </div>
          <ModalBody className="flex flex-col gap-[1.25rem] p-0 px-5 pb-5">
            <div
              className="flex cursor-pointer flex-col gap-[0.625rem] rounded-medium bg-secondary p-[0.62rem] transition-all hover:opacity-[var(--nextui-hover-opacity)] active:scale-[1.01]"
              onClick={() => setSelectCollatorOpen(true)}
            >
              <div className="text-[0.75rem] font-normal text-foreground/50">Collator</div>
              <div className="flex items-center justify-between">
                {selectedCollatorAddress ? (
                  <div className="flex items-center gap-[0.62rem]">
                    <Avatar address={selectedCollatorAddress} className="size-[1.625rem]" />
                    <div className="text-[0.875rem] font-bold text-foreground">
                      {toShortAddress(selectedCollatorAddress)}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-[0.62rem]">
                    {isCollatorLoading ? (
                      <Spinner
                        size="sm"
                        classNames={{
                          wrapper: cn('w-5 h-5')
                        }}
                      />
                    ) : (
                      <>
                        <div className="size-[1.625rem] rounded-full bg-[#c6c6c6]"></div>
                        <div className="text-[0.875rem] font-bold text-foreground">
                          Select a collator
                        </div>
                      </>
                    )}
                  </div>
                )}

                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={cn(
                    'transform transition-transform',
                    selectCollatorOpen ? 'rotate-180' : 'rotate-0'
                  )}
                />
              </div>
            </div>
            {/* todo  */}
            {/* Animation is not working when tabs are used inside a modal. */}
            {/* https://github.com/nextui-org/nextui/issues/2297 */}
            {/* https://github.com/framer/motion/issues/1302 */}
            <Tabs
              aria-label="Options"
              color="primary"
              variant="underlined"
              className="-mt-4"
              selectedKey={selected}
              onSelectionChange={handleTabChange}
              classNames={{
                tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                cursor: 'w-full bg-foreground font-bold',
                tab: 'max-w-fit px-0 h-12',
                tabContent: 'group-data-[selected=true]:text-foreground  font-bold'
              }}
            >
              {stakeTabs.map((tab) => (
                <Tab
                  key={tab.key}
                  title={
                    <div className="flex items-center space-x-2">
                      <span>{tab.label}</span>
                    </div>
                  }
                ></Tab>
              ))}
            </Tabs>
            <TransitionPanel
              activeIndex={selected === 'stake-ring' ? 0 : 1}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              variants={{
                enter: { opacity: 0, filter: 'blur(4px)' },
                center: { opacity: 1, filter: 'blur(0px)' },
                exit: { opacity: 0, filter: 'blur(4px)' }
              }}
            >
              {selected === 'stake-ring' && (
                <StakeRing ref={stakeRingRef} onAmountChange={handleAmountChange} />
              )}
              {selected === 'stake-deposit' && (
                <StakeDeposit ref={depositListRef} onCheckedDepositsChange={setCheckedDeposits} />
              )}
            </TransitionPanel>

            <Button
              color="primary"
              isDisabled={isDisabled}
              onClick={handleStake}
              isLoading={isPending}
              className="w-full font-bold"
            >
              {buttonText}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <SelectCollator
        isOpen={selectCollatorOpen}
        onClose={handleClose}
        selection={selectedCollatorAddress}
        onSelectionChange={handleSelectionChange}
      />
      <TransactionStatus
        hash={approvalHash}
        title="Approval"
        onSuccess={handleDepositStakeStart}
        onFail={handleTransactionFail}
        isLoading={isPendingDepositStake}
      />
      <TransactionStatus
        hash={hash}
        title="Staking"
        onSuccess={handleTransactionSuccess}
        onFail={handleTransactionFail}
      />
    </>
  );
};

export default NewStakeModal;
