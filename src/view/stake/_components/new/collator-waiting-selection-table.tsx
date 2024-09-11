import { Key, useCallback, useMemo, useState, useTransition } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Spinner,
  Pagination
} from '@nextui-org/react';
import { SearchIcon } from 'lucide-react';

import AddressCard from '@/components/address-card';
import type { CollatorSet } from '@/service/type';
import type { SelectionKeys } from '@/types/ui';
import { formatEther } from 'viem';
import FormattedNumberTooltip from '@/components/formatted-number-tooltip';
import { useWaitingCollatorList } from '@/hooks/useCollatorList';

interface CollatorSelectionTableProps {
  symbol: string;
  selection: SelectionKeys;
  onSelectionChange?: (keys: SelectionKeys) => void;
}

const PAGE_SIZE = 10;
const CollatorSelectionTable = ({
  symbol,
  selection,
  onSelectionChange
}: CollatorSelectionTableProps) => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, []);

  const handleSearchChange = useCallback((keyword: string) => {
    startTransition(() => {
      setKeyword?.(keyword);
      setPage(0);
    });
  }, []);

  const { list, isLoading } = useWaitingCollatorList({
    enabled: true,
    page: page - 1,
    pageSize: PAGE_SIZE
  });

  const handleClear = useCallback(() => {
    setKeyword?.('');
  }, []);

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

  const renderCell = useCallback((item: CollatorSet, columnKey: Key) => {
    const cellValue = item[columnKey as keyof CollatorSet];

    switch (columnKey) {
      case 'collator':
        return <AddressCard address={item.address as `0x${string}`} />;
      case 'balance': {
        const formattedBalance = formatEther(item.assets ? BigInt(item.assets) : 0n);
        return (
          <FormattedNumberTooltip value={formattedBalance}>
            {(formattedValue) => <span className="line-clamp-1">{formattedValue}</span>}
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
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginatedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        selectedKeys={selection}
        onSelectionChange={onSelectionChange}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'overflow-auto max-h-[50vh] rounded-medium  p-0 bg-secondary',
          td: 'text-foreground'
        }}
        bottomContent={
          data.length ? (
            <div className="flex w-full justify-end">
              <Pagination
                showControls
                page={page}
                total={totalPages}
                size="sm"
                onChange={handlePageChange}
              />
            </div>
          ) : null
        }
        layout="fixed"
      >
        <TableHeader>
          <TableColumn className="w-[10rem] bg-secondary" key="collator" width={100}>
            Collator
          </TableColumn>
          <TableColumn className="w-[6rem] bg-secondary" key="balance" width={50}>
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
          items={paginatedData || []}
          loadingContent={
            <div className="absolute inset-0 flex w-full items-center justify-center bg-background/50">
              <Spinner />
            </div>
          }
          emptyContent={<div className="text-center">No records</div>}
          loadingState={isLoading || isPending ? 'loading' : 'idle'}
        >
          {(item: CollatorSet) => (
            <TableRow key={item?.id}>
              {(columnKey: Key) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default CollatorSelectionTable;
