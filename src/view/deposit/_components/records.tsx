import { Button, cn, Pagination, Progress, Skeleton } from '@nextui-org/react';
import { ExternalLink } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSwitchChain } from 'wagmi';

import { useUserDepositDetails } from '@/hooks/useUserDepositDetails';
import { formatEther } from 'viem';

import type { DepositInfo } from '@/hooks/useUserDepositDetails';
import type { BaseError } from 'wagmi';
import useWalletStatus from '@/hooks/useWalletStatus';
import { address as depositAddress } from '@/config/abi/deposit';
import { checkIsClaimRequirePenalty } from '@/view/deposit/service';
import WithdrawEarlier from './withdraw-earlier';
import { useWithdraw } from '@/view/deposit/_hooks/withdraw';
import TransactionStatus from '@/components/transaction-status';
import AsyncButton from '@/components/async-button';
import { error } from '@/components/toast';
import FormattedNumberTooltip from '@/components/formatted-number-tooltip';
import { calculateDepositProgress } from '@/utils/date';
import { getDefaultChainId } from '@/utils/chain';
import Empty from '@/components/empty';

const PAGE_SIZE = 3;

interface DepositRecordsProps {
  onRefreshRingBalance?: () => void;
}

const DepositRecords = ({ onRefreshRingBalance }: DepositRecordsProps) => {
  const { address, currentChain, ktonInfo, isEnabled, isSupportedChain } = useWalletStatus();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const [page, setPage] = useState(1);
  const [currentTokenId, setCurrentTokenId] = useState<bigint>();
  const [withdrawEarlierOpen, setWithdrawEarlierOpen] = useState<boolean>(false);
  const [withdrawHash, setWithdrawHash] = useState<`0x${string}` | undefined>(undefined);
  const {
    depositList,
    isLoading: isDepositListLoading,
    deleteDepositInfoByTokenId
  } = useUserDepositDetails({
    enabled: isEnabled
  });
  const { withdraw } = useWithdraw();

  const handleSwitchChain = useCallback(() => {
    switchChain({ chainId: getDefaultChainId() });
  }, [switchChain]);

  const handleWithdraw = useCallback(
    async (tokenId: bigint) => {
      setCurrentTokenId(tokenId);
      try {
        const tx = await withdraw(tokenId);
        if (tx) {
          setWithdrawHash(tx);
        }
      } catch (cause) {
        console.warn('Error withdrawing:', cause);
        error((cause as BaseError).shortMessage || 'Something went wrong while withdrawing');
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
      } catch (cause) {
        console.error('Error checking claim penalty:', cause);
        error('Unable to confirm the early withdrawal penalty');
        setCurrentTokenId(undefined);
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
    if (currentTokenId !== undefined) {
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
    setCurrentTokenId(undefined);
  }, []);

  const handleWithdrawSuccess = useCallback(() => {
    if (currentTokenId !== undefined) {
      deleteDepositInfoByTokenId(currentTokenId);
      onRefreshRingBalance?.();
    }
    handleWithdrawFail();
  }, [deleteDepositInfoByTokenId, currentTokenId, handleWithdrawFail, onRefreshRingBalance]);

  const totalPages = Math.max(1, Math.ceil((depositList?.length || 0) / PAGE_SIZE));
  const paginatedData = useMemo(
    () => depositList?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) || [],
    [depositList, page]
  );

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  return (
    <>
      <section aria-labelledby="deposit-ticket-heading" className="flex flex-col gap-[0.62rem]">
        <div className="flex items-center justify-between">
          <h2 id="deposit-ticket-heading" className="m-0 text-[0.875rem] font-bold text-foreground">
            My Deposit Tickets
          </h2>
          {isEnabled && depositList.length > 0 ? (
            <span className="text-[0.75rem] text-foreground/50">
              {depositList.length} {depositList.length === 1 ? 'ticket' : 'tickets'}
            </span>
          ) : null}
        </div>

        {!address ? (
          <Empty label="Connect wallet to view existing deposit tickets" />
        ) : !isSupportedChain ? (
          <div className="flex flex-col gap-[0.62rem]">
            <Empty label="Switch to Darwinia to view existing deposit tickets" />
            <Button
              color="primary"
              variant="flat"
              className="w-full font-bold"
              isLoading={isSwitchingChain}
              onPress={handleSwitchChain}
            >
              Switch to Darwinia
            </Button>
          </div>
        ) : isDepositListLoading ? (
          <div aria-label="Loading deposit tickets" className="flex flex-col gap-[0.62rem]">
            <Skeleton className="h-[11.5rem] w-full rounded-medium" />
            <Skeleton className="h-[11.5rem] w-full rounded-medium" />
          </div>
        ) : paginatedData.length === 0 ? (
          <Empty label="No deposit tickets available to withdraw" />
        ) : (
          <div className="flex flex-col gap-[0.62rem]">
            {paginatedData.map((item: DepositInfo) => {
              const { startAtDate, endAtDate, progressValue } = calculateDepositProgress(
                item.startAt,
                item.endAt
              );
              const explorerUrl = currentChain?.blockExplorers?.default.url;
              const tokenUrl = explorerUrl
                ? `${explorerUrl}/token/${depositAddress}/instance/${item.tokenId.toString()}`
                : undefined;

              return (
                <article
                  key={item.tokenId}
                  className="flex flex-col gap-[0.62rem] rounded-medium bg-secondary p-[0.62rem]"
                >
                  <div className="flex items-center justify-between gap-2">
                    {tokenUrl ? (
                      <a
                        href={tokenUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-w-0 items-center gap-1 truncate text-[0.75rem] font-bold text-primary transition-opacity hover:opacity-[var(--nextui-hover-opacity)]"
                      >
                        <span className="truncate">Token ID [{item.tokenId.toString()}]</span>
                        <ExternalLink
                          aria-hidden="true"
                          className="flex-shrink-0"
                          size={12}
                          strokeWidth={2}
                        />
                      </a>
                    ) : (
                      <span className="truncate text-[0.75rem] font-bold text-foreground">
                        Token ID [{item.tokenId.toString()}]
                      </span>
                    )}
                    <span
                      className={cn(
                        'flex-shrink-0 rounded-small px-2 py-1 text-[0.6875rem] font-bold',
                        item.isClaimRequirePenalty
                          ? 'bg-default-200 text-foreground/60'
                          : 'bg-success/15 text-success'
                      )}
                    >
                      {item.isClaimRequirePenalty ? 'Locked' : 'Ready'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-[0.62rem] text-[0.75rem]">
                    <div className="flex flex-col gap-1">
                      <span className="text-foreground/50">Amount</span>
                      <FormattedNumberTooltip value={formatEther(item.value)}>
                        {(formattedValue) => (
                          <span className="font-bold text-foreground">
                            {formattedValue} {currentChain?.nativeCurrency?.symbol}
                          </span>
                        )}
                      </FormattedNumberTooltip>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-foreground/50">Maturity</span>
                      <span className="font-bold text-foreground">{endAtDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[0.6875rem] text-foreground/50">
                      <span>{startAtDate}</span>
                      <span>{endAtDate}</span>
                    </div>
                    <Progress
                      aria-label={`Deposit ${item.tokenId.toString()} duration`}
                      value={progressValue}
                      size="sm"
                      color="primary"
                    />
                  </div>

                  <AsyncButton
                    color="primary"
                    variant={item.isClaimRequirePenalty ? 'flat' : 'solid'}
                    className="w-full font-bold"
                    loadingText="Pending"
                    isDisabled={!isEnabled}
                    onClick={() =>
                      item.isClaimRequirePenalty
                        ? handleWithdrawEarlier(item.tokenId)
                        : handleWithdraw(item.tokenId)
                    }
                  >
                    {item.isClaimRequirePenalty ? 'Withdraw Early' : 'Withdraw'}
                  </AsyncButton>
                </article>
              );
            })}
          </div>
        )}

        {isEnabled && depositList.length > PAGE_SIZE ? (
          <div className="flex w-full justify-end pt-1">
            <Pagination showControls size="sm" page={page} total={totalPages} onChange={setPage} />
          </div>
        ) : null}
      </section>

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

export default DepositRecords;
