import {
  cn,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
  Progress,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react';
import { X } from 'lucide-react';
import { Key, useCallback, useEffect, useState } from 'react';

import { useUserDepositDetails } from '@/hooks/useUserDepositDetails';
import { formatEther } from 'viem';

import type { DepositInfo } from '@/hooks/useUserDepositDetails';
import useWalletStatus from '@/hooks/useWalletStatus';
import { checkIsClaimRequirePenalty } from '@/view/deposit/service';
import WithdrawEarlier from './withdraw-earlier';
import { useWithdraw } from '@/view/deposit/_hooks/withdraw';
import TransactionStatus from '@/components/transaction-status';
import AsyncButton from '@/components/async-button';
import { error } from '@/components/toast';
import FormattedNumberTooltip from '@/components/formatted-number-tooltip';
import { calculateDepositProgress } from '@/utils/date';

const PAGE_SIZE = 10;
interface DepositRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshRingBalance?: () => void;
}

const DepositRecordsModal = ({
  isOpen,
  onClose,
  onRefreshRingBalance
}: DepositRecordsModalProps) => {
  const { currentChain, ktonInfo } = useWalletStatus();
  const [page, setPage] = useState(1);
  const [currentTokenId, setCurrentTokenId] = useState<bigint>();
  const [withdrawEarlierOpen, setWithdrawEarlierOpen] = useState<boolean>(false);
  const [withdrawHash, setWithdrawHash] = useState<`0x${string}` | undefined>(undefined);
  const {
    depositList,
    isLoading: isDepositListLoading,
    deleteDepositInfoByTokenId
  } = useUserDepositDetails({
    enabled: isOpen
  });
  const { withdraw } = useWithdraw();

  const handleWithdraw = useCallback(
    async (tokenId: bigint) => {
      setCurrentTokenId(tokenId);
      try {
        const tx = await withdraw(tokenId)?.catch((e) => {
          error(e.shortMessage);
        });
        if (tx) {
          setWithdrawHash(tx);
        }
      } catch (e) {
        console.warn('Error withdrawing:', e);
        error('Something went wrong while withdrawing');
        setCurrentTokenId(undefined);
      }
    },
    [withdraw]
  );

  const handleWithdrawEarlier = useCallback(
    async (tokenId: bigint) => {
      setCurrentTokenId(tokenId);

      try {
        const isClaimRequirePenalty = await checkIsClaimRequirePenalty(tokenId);
        if (isClaimRequirePenalty) {
          setWithdrawEarlierOpen(true);
        } else {
          await handleWithdraw(tokenId);
        }
      } catch (error) {
        console.error('Error checking claim penalty:', error);
      }
    },
    [handleWithdraw]
  );

  const handleCloseWithdrawEarlier = useCallback(() => {
    setWithdrawHash(undefined);
    setCurrentTokenId(undefined);
    setWithdrawEarlierOpen(false);
  }, []);

  const handleWithdrawEarlierSuccess = useCallback(() => {
    if (currentTokenId) {
      deleteDepositInfoByTokenId(currentTokenId);
      onRefreshRingBalance?.();
    }
    setWithdrawHash(undefined);
    setWithdrawEarlierOpen(false);
    handleCloseWithdrawEarlier();
  }, [
    deleteDepositInfoByTokenId,
    currentTokenId,
    handleCloseWithdrawEarlier,
    onRefreshRingBalance
  ]);

  const handleWithdrawFail = useCallback(() => {
    setWithdrawHash(undefined);
  }, []);

  const handleWithdrawSuccess = useCallback(() => {
    if (currentTokenId) {
      deleteDepositInfoByTokenId(currentTokenId);
      onRefreshRingBalance?.();
    }
    handleWithdrawFail();
  }, [deleteDepositInfoByTokenId, currentTokenId, handleWithdrawFail, onRefreshRingBalance]);

  const renderCell = useCallback(
    (item: DepositInfo, columnKey: Key) => {
      const cellValue = item[columnKey as keyof DepositInfo];

      switch (columnKey) {
        case 'tokenId':
          return (
            <div className="text-[0.875rem] font-bold text-primary">
              <a
                href={`${currentChain?.blockExplorers?.default.url}/token/0x46275d29113f065c2aac262f34C7a3d8a8B7377D/instance/${cellValue.toString()}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Token ID [{cellValue.toString()}]
              </a>
            </div>
          );

        case 'value': {
          return (
            <FormattedNumberTooltip value={formatEther(item?.value)}>
              {(formattedValue) => (
                <span className="text-[0.875rem] font-normal text-foreground">
                  {formattedValue}{' '}
                  <span className="text-[0.875rem] font-normal text-foreground">
                    {currentChain?.nativeCurrency?.symbol}
                  </span>
                </span>
              )}
            </FormattedNumberTooltip>
          );
        }

        case 'duration': {
          const { startAtDate, endAtDate, progressValue } = calculateDepositProgress(
            item?.startAt,
            item?.endAt
          );

          return (
            <Progress
              classNames={{
                label: 'w-full'
              }}
              label={
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">{`${startAtDate} - ${endAtDate}`}</div>
                </div>
              }
              value={progressValue}
              className="w-full gap-1"
              size="sm"
              color="primary"
            />
          );
        }

        case 'action': {
          if (item.isClaimRequirePenalty) {
            return (
              <AsyncButton
                color="primary"
                size="sm"
                loadingText="Pending"
                onClick={() => handleWithdrawEarlier(item.tokenId)}
              >
                Withdraw Earlier
              </AsyncButton>
            );
          } else {
            return (
              <AsyncButton
                color="primary"
                size="sm"
                loadingText="Pending"
                onClick={() => handleWithdraw(item.tokenId)}
              >
                Withdraw
              </AsyncButton>
            );
          }
        }

        default:
          return null;
      }
    },
    [
      currentChain?.nativeCurrency?.symbol,
      currentChain?.blockExplorers?.default.url,
      handleWithdrawEarlier,
      handleWithdraw
    ]
  );
  const totalPages = Math.ceil((depositList?.length || 0) / PAGE_SIZE);
  const paginatedData = depositList?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (!isOpen) {
      setPage(1);
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="center"
        onClose={onClose}
        className="bg-background"
        backdrop="blur"
        classNames={{
          base: 'max-w-[800px]',
          closeButton:
            'p-0 top-[1.25rem] right-[1.25rem] hover:opacity-[var(--nextui-hover-opacity)] hover:bg-transparent  z-10'
        }}
        closeButton={<X />}
      >
        <ModalContent className="w-[calc(100vw-1.24rem)] px-5 py-0 md:w-[47.75rem]">
          <ModalHeader className="px-0 py-5 text-[1.125rem] font-bold text-foreground">
            <span>Deposit in Wallet</span>
          </ModalHeader>
          <Divider />
          <ModalBody
            className={cn('relative px-0 py-5', isDepositListLoading ? 'overflow-hidden' : '')}
          >
            <Table
              aria-label="deposit records table"
              color="primary"
              layout="fixed"
              classNames={{
                wrapper:
                  'overflow-auto max-h-[50vh] rounded-medium  p-0 shadow-none bg-background dark:bg-secondary',
                td: 'text-foreground'
              }}
              bottomContentPlacement="outside"
              bottomContent={
                depositList?.length ? (
                  <div className="flex w-full justify-end">
                    <Pagination
                      showControls
                      size="sm"
                      page={page}
                      total={totalPages}
                      onChange={(newPage) => setPage(newPage)}
                    />
                  </div>
                ) : null
              }
            >
              <TableHeader>
                <TableColumn className="w-[9.375rem] bg-secondary" key="tokenId">
                  ERC-721
                </TableColumn>
                <TableColumn className="w-[15.625rem] bg-secondary" key="duration" align="center">
                  Duration
                </TableColumn>
                <TableColumn className="w-[9.375rem] bg-secondary" key="value" align="center">
                  Amount
                </TableColumn>
                <TableColumn className="w-[9.375rem] bg-secondary" key="action" align="end">
                  Action
                </TableColumn>
              </TableHeader>
              <TableBody
                items={paginatedData || []}
                emptyContent={<div className="text-center">No deposit in wallet</div>}
                className="relative"
                loadingContent={
                  <div className="absolute inset-0 flex w-full items-center justify-center bg-background/50">
                    <Spinner />
                  </div>
                }
                loadingState={isDepositListLoading ? 'loading' : 'idle'}
              >
                {(item: DepositInfo) => (
                  <TableRow key={item?.tokenId}>
                    {(columnKey: Key) => {
                      return <TableCell>{renderCell(item, columnKey)}</TableCell>;
                    }}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
      <WithdrawEarlier
        symbol={ktonInfo?.symbol || ''}
        tokenId={currentTokenId}
        isOpen={withdrawEarlierOpen}
        onClose={handleCloseWithdrawEarlier}
        onSuccess={handleWithdrawEarlierSuccess}
      />
      <TransactionStatus
        hash={withdrawHash}
        title="Withdraw"
        onSuccess={handleWithdrawSuccess}
        onFail={handleWithdrawFail}
      />
    </>
  );
};

export default DepositRecordsModal;
