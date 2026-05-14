import { Key, useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Spinner,
  Tooltip
} from '@nextui-org/react';
import { AlertTriangle, SearchIcon } from 'lucide-react';

import AddressCard from '@/components/address-card';
import { formatEther } from 'viem';
import FormattedNumberTooltip from '@/components/formatted-number-tooltip';
import { useActiveCollatorList, type CollatorWithLastReward } from '@/hooks/useCollatorList';
import type { CollatorSet } from '@/service/type';
import { formatRelativeTimeShort } from '@/utils/date';
import { BLACKLISTED_COLLATOR_TOOLTIP, isBlacklistedCollator } from '@/config/collator-blacklist';

interface CollatorSelectionTableProps {
  symbol: string;
  selectedCollator?: CollatorSet;
  onSelectCollatorChange?: (collator: CollatorSet) => void;
}

const CollatorSelectionTable = ({
  symbol,
  selectedCollator,
  onSelectCollatorChange
}: CollatorSelectionTableProps) => {
  const [keyword, setKeyword] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSearchChange = useCallback((keyword: string) => {
    startTransition(() => {
      setKeyword?.(keyword);
    });
  }, []);
  const { list, isLoading: isCollatorListLoading } = useActiveCollatorList({
    enabled: true
  });

  const data = useMemo(() => {
    if (keyword) {
      if (!list?.length) {
        return [];
      }
      const lowercaseKeyword = keyword.trim()?.toLowerCase();
      return list.filter((collator) => collator.address.toLowerCase().includes(lowercaseKeyword));
    }
    return list || [];
  }, [list, keyword]);

  const handleClear = useCallback(() => {
    setKeyword('');
  }, []);

  const renderCell = useCallback((item: CollatorWithLastReward, columnKey: Key) => {
    const cellValue = item[columnKey as keyof CollatorSet];
    const isBlacklisted = isBlacklistedCollator(item.address);

    switch (columnKey) {
      case 'collator':
        return (
          <div className="flex items-center gap-2">
            <AddressCard address={item.address as `0x${string}`} />
            {isBlacklisted && (
              <Tooltip closeDelay={0} content={BLACKLISTED_COLLATOR_TOOLTIP} placement="top">
                <span className="flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
                  <AlertTriangle size={14} />
                  Risk
                </span>
              </Tooltip>
            )}
          </div>
        );
      case 'balance': {
        const formattedBalance = formatEther(item.assets ? BigInt(item.assets) : 0n);
        return (
          <FormattedNumberTooltip value={formattedBalance}>
            {(formattedValue) => (
              <div className="w-full overflow-hidden">
                <span className="block truncate">{formattedValue}</span>
              </div>
            )}
          </FormattedNumberTooltip>
        );
      }
      case 'commission':
        return cellValue ? `${cellValue}%` : '-';
      case 'session': {
        const formattedReward = formatEther(item.reward ? BigInt(item.reward) : 0n);
        const relativeTime = formatRelativeTimeShort(item.lastReward?.blockTimestamp);
        const timeLabel =
          relativeTime !== '-' ? `(${relativeTime === 'now' ? 'now' : `${relativeTime} ago`})` : '';

        return (
          <FormattedNumberTooltip value={formattedReward}>
            {(formattedValue) => (
              <span className="line-clamp-1 text-right">
                {formattedValue} <span className="text-foreground/50">{timeLabel}</span>
              </span>
            )}
          </FormattedNumberTooltip>
        );
      }
      default:
        return null;
    }
  }, []);

  useEffect(() => {
    return () => {
      setKeyword('');
    };
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <Input
        isClearable
        classNames={{
          inputWrapper:
            'w-[18.75rem] h-10 items-center gap-[0.3125rem] rounded-medium dark:!bg-secondary',
          input: 'placeholder:text-foreground/50 text-[0.875rem] text-foreground'
        }}
        placeholder="Search for a collator"
        startContent={<SearchIcon className="text-foreground/50" />}
        value={keyword}
        aria-label="Search for a collator"
        onClear={handleClear}
        onValueChange={handleSearchChange}
      />
      <Table
        isHeaderSticky
        aria-label="Select collator table"
        color="primary"
        selectionMode="single"
        selectionBehavior="replace"
        selectedKeys={selectedCollator?.address}
        disabledKeys={data
          .filter((item) => isBlacklistedCollator(item.address))
          .map((item) => item.id)}
        bottomContentPlacement="outside"
        classNames={{
          wrapper:
            'overflow-auto max-h-[50vh] rounded-medium  p-0 shadow-none bg-background dark:bg-secondary',
          td: 'text-foreground'
        }}
        layout="fixed"
      >
        <TableHeader>
          <TableColumn className="w-[10rem] bg-secondary" key="collator" width={100}>
            Collator
          </TableColumn>
          <TableColumn className="w-[8rem] bg-secondary" key="balance" width={50}>
            Staked {symbol}
          </TableColumn>
          <TableColumn className="w-[4.43rem] bg-secondary" key="commission" width={40}>
            Commission
          </TableColumn>
          <TableColumn
            className="w-[6rem] whitespace-normal bg-secondary"
            width={60}
            key="session"
            align="end"
          >
            Last Session rewards
          </TableColumn>
        </TableHeader>
        <TableBody
          items={data || []}
          loadingContent={
            <div className="absolute inset-0 flex w-full items-center justify-center bg-background/50">
              <Spinner />
            </div>
          }
          emptyContent={<div className="text-center">No records</div>}
          loadingState={isCollatorListLoading || isPending ? 'loading' : 'idle'}
        >
          {(item: CollatorWithLastReward) => (
            <TableRow
              key={item?.id}
              className={
                isBlacklistedCollator(item.address)
                  ? 'cursor-not-allowed bg-danger/5 text-danger opacity-80'
                  : 'cursor-pointer'
              }
              onClick={() => {
                if (isBlacklistedCollator(item.address)) {
                  return;
                }
                onSelectCollatorChange?.(item);
              }}
            >
              {(columnKey: Key) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default CollatorSelectionTable;
