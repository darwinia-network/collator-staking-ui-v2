import { useMemo, useCallback, useState, useEffect } from 'react';
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Tooltip
} from '@nextui-org/react';
import { formatEther } from 'viem';
import { X } from 'lucide-react';
import AddressCard from '@/components/address-card';
import FormattedNumberTooltip from '@/components/formatted-number-tooltip';
import StakeMore from './stake-more';
import Unstake from './unstake';
import StakeMoreDeposits from './stake-more-deposits';
import UnstakeDeposits from './unstake-deposts';
import { useStaked } from '../../_hooks/staked';
import { useCollatorByAddress } from '@/hooks/useService';

interface StakeManagementModalProps {
  isOpen: boolean;
  symbol: string;
  collatorAddress: `0x${string}`;
  onClose: () => void;
  onSuccess: () => void;
}

const StakeManagementModal = ({
  isOpen,
  symbol,
  collatorAddress,
  onClose,
  onSuccess
}: StakeManagementModalProps) => {
  const [isStakeMoreOpen, setIsStakeMoreOpen] = useState(false);
  const [isUnstakeOpen, setIsUnstakeOpen] = useState(false);
  const [isStakeMoreDepositsOpen, setIsStakeMoreDepositsOpen] = useState(false);
  const [isUnstakeDepositsOpen, setIsUnstakeDepositsOpen] = useState(false);
  const {
    data: collators,
    isLoading: isCollatorLoading,
    isRefetching: isCollatorRefetching,
    refetch: refetchCollator
  } = useCollatorByAddress({
    address: collatorAddress,
    enabled: !!collatorAddress && isOpen
  });

  const collator = useMemo(() => {
    return collators?.[0];
  }, [collators]);

  const isInactive = collator?.inset === 0;

  const { stakedRING, stakingLocks, stakedDeposits, isLoading, refetch } = useStaked({
    collatorAddress: collatorAddress,
    enabled: isOpen
  });

  const formattedStakedRING = useMemo(() => {
    return stakedRING ? formatEther(stakedRING) : '0';
  }, [stakedRING]);

  const isLocked = useMemo(() => {
    if (stakingLocks) {
      const now = BigInt(Math.floor(Date.now() / 1000));
      return stakingLocks > now;
    }
    return false;
  }, [stakingLocks]);

  const handleSuccess = useCallback(() => {
    refetch();
    refetchCollator();
    onSuccess();
  }, [refetch, refetchCollator, onSuccess]);

  const handleOkStakeMore = useCallback(() => {
    setIsStakeMoreOpen(false);
    handleSuccess();
  }, [handleSuccess]);

  const handleCloseStakeMore = useCallback(() => {
    setIsStakeMoreOpen(false);
  }, []);

  const handleOkUnstake = useCallback(() => {
    setIsUnstakeOpen(false);
    handleSuccess();
  }, [handleSuccess]);

  const handleCloseUnstake = useCallback(() => {
    setIsUnstakeOpen(false);
  }, []);

  const handleOkStakeMoreDeposits = useCallback(() => {
    setIsStakeMoreDepositsOpen(false);
    handleSuccess();
  }, [handleSuccess]);

  const handleCloseStakeMoreDeposits = useCallback(() => {
    setIsStakeMoreDepositsOpen(false);
  }, []);

  const handleOkUnstakeDeposits = useCallback(() => {
    setIsUnstakeDepositsOpen(false);
    handleSuccess();
  }, [handleSuccess]);

  const handleCloseUnstakeDeposits = useCallback(() => {
    setIsUnstakeDepositsOpen(false);
  }, []);

  const handleUnstakeRingOpen = useCallback(() => {
    setIsUnstakeOpen(true);
  }, []);
  const handleStakeMoreOpen = useCallback(() => {
    setIsStakeMoreOpen(true);
  }, []);

  const handleUnstakeDepositsOpen = useCallback(() => {
    setIsUnstakeDepositsOpen(true);
  }, []);
  const handleStakeMoreDepositsOpen = useCallback(() => {
    setIsStakeMoreDepositsOpen(true);
  }, []);

  const UnstakeButton = useMemo(() => {
    return (
      <Button
        variant="flat"
        size="sm"
        color="primary"
        isDisabled={isLocked}
        className="font-bold"
        onClick={handleUnstakeRingOpen}
      >
        Unstake
      </Button>
    );
  }, [handleUnstakeRingOpen, isLocked]);

  const renderDays = useMemo(() => {
    return (
      <span>
        <span className="text-primary">1</span> day
      </span>
    );
  }, []);

  const formattedStakedDeposits = useMemo(() => {
    if (stakedDeposits?.length) {
      const amount = stakedDeposits.reduce((acc, deposit) => {
        return acc + deposit.amount;
      }, 0n);
      return formatEther(amount);
    }
    return '0';
  }, [stakedDeposits]);

  const UnstakeDepositsButton = useMemo(() => {
    return (
      <Button
        variant="flat"
        size="sm"
        color="primary"
        className="font-bold"
        isDisabled={formattedStakedDeposits === '0'}
        onClick={handleUnstakeDepositsOpen}
      >
        Unstake
      </Button>
    );
  }, [handleUnstakeDepositsOpen, formattedStakedDeposits]);

  useEffect(() => {
    if (isOpen) {
      refetchCollator();
    }
  }, [isOpen, refetch, refetchCollator]);

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
          <ModalHeader className="px-0 py-5 text-[1.125rem] text-foreground">
            Manage Stake
          </ModalHeader>
          <Divider />
          <ModalBody
            className="relative flex w-full flex-col items-center justify-center gap-5 px-0 py-5"
            style={{
              pointerEvents:
                isLoading || isCollatorLoading || isCollatorRefetching ? 'none' : 'auto'
            }}
          >
            {(isLoading || isCollatorLoading || isCollatorRefetching) && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <Spinner />
              </div>
            )}

            <div className="flex w-full flex-col gap-[0.62rem]">
              <div className="flex flex-col gap-[0.62rem] rounded-medium bg-secondary p-[0.62rem] hover:opacity-[var(--nextui-opacity-hover)]">
                <p className="m-0 text-[0.875rem] text-foreground/50">Collator</p>
                <div className="flex items-center justify-between">
                  <AddressCard address={collatorAddress as `0x${string}`} copyable={false} />
                </div>
              </div>

              <div className="flex flex-col gap-[0.62rem] rounded-medium bg-secondary p-[0.62rem] hover:opacity-[var(--nextui-opacity-hover)]">
                <p className="m-0 text-[0.875rem] text-foreground/50">{symbol}</p>
                <div className="flex items-center justify-between">
                  <FormattedNumberTooltip value={formattedStakedRING}>
                    {(formattedValue) => (
                      <p className="m-0 text-[0.875rem] font-bold text-foreground">
                        {formattedValue}
                      </p>
                    )}
                  </FormattedNumberTooltip>
                  <div className="flex items-center gap-[0.62rem]">
                    {isLocked ? (
                      <Tooltip
                        content={
                          <div className="max-w-[16.25rem] p-2 text-[0.75rem] font-normal text-foreground">
                            You can perform the unstake operation {renderDays} after your last stake
                            with the selected collator. You have {renderDays} remaining before you
                            can unstake.
                          </div>
                        }
                        closeDelay={0}
                        color="default"
                        showArrow
                      >
                        <div>{UnstakeButton}</div>
                      </Tooltip>
                    ) : (
                      UnstakeButton
                    )}
                    {!isInactive && (
                      <Button
                        size="sm"
                        color="primary"
                        onClick={handleStakeMoreOpen}
                        className="font-bold"
                      >
                        Stake
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[0.62rem] rounded-medium bg-secondary p-[0.62rem] hover:opacity-[var(--nextui-opacity-hover)]">
                <p className="m-0 text-[0.875rem] text-foreground/50">Deposit {symbol}</p>
                <div className="flex items-center justify-between">
                  <FormattedNumberTooltip value={formattedStakedDeposits}>
                    {(formattedValue) => (
                      <p className="m-0 text-[0.875rem] font-bold text-foreground">
                        {formattedValue}
                      </p>
                    )}
                  </FormattedNumberTooltip>
                  <div className="flex items-center gap-[0.62rem]">
                    {UnstakeDepositsButton}
                    {!isInactive && (
                      <Button
                        size="sm"
                        color="primary"
                        className="font-bold"
                        onClick={handleStakeMoreDepositsOpen}
                      >
                        Stake
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <StakeMore
        isOpen={isStakeMoreOpen}
        onClose={handleCloseStakeMore}
        onOk={handleOkStakeMore}
        collator={collator}
      />
      <Unstake
        isOpen={isUnstakeOpen}
        isInactive={isInactive}
        onClose={handleCloseUnstake}
        symbol={symbol}
        totalAmount={formattedStakedRING}
        onOk={handleOkUnstake}
        collator={collator}
      />
      <StakeMoreDeposits
        isOpen={isStakeMoreDepositsOpen}
        onClose={handleCloseStakeMoreDeposits}
        onOk={handleOkStakeMoreDeposits}
        collator={collator}
      />
      <UnstakeDeposits
        isOpen={isUnstakeDepositsOpen}
        isInactive={isInactive}
        onClose={handleCloseUnstakeDeposits}
        onOk={handleOkUnstakeDeposits}
        symbol={symbol}
        isLocked={isLocked}
        renderDays={renderDays}
        deposits={stakedDeposits}
        collator={collator}
      />
    </>
  );
};

export default StakeManagementModal;
