import { Key, useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Spinner
} from '@nextui-org/react';
import { SearchIcon } from 'lucide-react';

import AddressCard from '@/components/address-card';
import type { CollatorSet } from '@/service/type';
import { formatEther } from 'viem';
import FormattedNumberTooltip from '@/components/formatted-number-tooltip';
import { useActiveCollatorList } from '@/hooks/useCollatorList';

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

  const renderCell = useCallback((item: CollatorSet, columnKey: Key) => {
    const cellValue = item[columnKey as keyof CollatorSet];

    switch (columnKey) {
      case 'collator':
        return <AddressCard address={item.address as `0x${string}`} />;
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
        return (
          <FormattedNumberTooltip value={formattedReward}>
            {(formattedValue) => <span className="line-clamp-1">{formattedValue}</span>}
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
          {(item: CollatorSet) => (
            <TableRow
              key={item?.id}
              onClick={() => {
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
