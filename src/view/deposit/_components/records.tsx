import {
  cn,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
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
import { formatNumericValue } from '@/utils';
import { checkIsClaimRequirePenalty } from '@/view/deposit/service';
import WithdrawEarlier from './withdraw-earlier';
import { useWithdraw } from '@/view/deposit/_hooks/withdraw';
import TransactionStatus from '@/components/transaction-status';
import AsyncButton from '@/components/async-button';
import { error } from '@/components/toast';

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

      const formattedValue = formatNumericValue(formatEther(item?.value), 3);

      switch (columnKey) {
        case 'tokenId':
          return (
            <div className="text-[0.875rem] font-bold text-primary">ID #{cellValue.toString()}</div>
          );

        case 'value':
          return (
            <span>
              {formattedValue.fixed} {currentChain?.nativeCurrency?.symbol}
            </span>
          );

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
    [currentChain?.nativeCurrency?.symbol, handleWithdrawEarlier, handleWithdraw]
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
        size="xl"
        className="bg-background"
        backdrop="blur"
        classNames={{
          closeButton:
            'p-0 top-[1.25rem] right-[1.25rem] hover:opacity-[var(--nextui-hover-opacity)] hover:bg-transparent  z-10'
        }}
        closeButton={<X />}
      >
        <ModalContent className="w-[calc(100vw-1.24rem)] px-5 py-0 md:w-[35.625rem]">
          <ModalHeader className="px-0 py-5 text-[1.125rem] font-bold text-foreground">
            <span>Wallet Deposit</span>
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
                wrapper: 'overflow-auto max-h-[50vh] rounded-medium  p-0 bg-secondary',
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
                  No.
                </TableColumn>
                <TableColumn className="w-[10.625rem] bg-secondary" key="value">
                  Amount
                </TableColumn>
                <TableColumn className="w-[9.375rem] bg-secondary" key="action" align="end">
                  Action
                </TableColumn>
              </TableHeader>
              <TableBody
                items={paginatedData || []}
                emptyContent={<div className="text-center">No active deposit records</div>}
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
