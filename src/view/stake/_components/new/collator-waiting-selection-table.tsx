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
  Button
} from '@nextui-org/react';
import { SearchIcon } from 'lucide-react';

import AddressCard from '@/components/address-card';
import type { CollatorSet } from '@/service/type';
import { formatEther } from 'viem';
import FormattedNumberTooltip from '@/components/formatted-number-tooltip';
import { useWaitingCollatorList } from '@/hooks/useCollatorList';
import { useDebouncedState } from '@/hooks/useDebouncedState';

interface CollatorWaitingSelectionTableProps {
  symbol: string;
  selectedCollator?: CollatorSet;
  onSelectCollatorChange?: (collator: CollatorSet) => void;
}

const PAGE_SIZE = 10;
const CollatorWaitingSelectionTable = ({
  symbol,
  selectedCollator,
  onSelectCollatorChange
}: CollatorWaitingSelectionTableProps) => {
  const {
    value: keyword,
    debouncedValue: debouncedKeyword,
    reset: resetKeyword,
    setValue: setKeyword
  } = useDebouncedState<string>({
    initialValue: ''
  });

  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const handleValueChange = useCallback(
    (keyword: string) => {
      startTransition(() => {
        setKeyword(keyword);
        setPage(1);
      });
    },
    [setKeyword, setPage]
  );

  const { list, isLoading } = useWaitingCollatorList({
    enabled: true,
    page,
    searchedAddress: debouncedKeyword?.toLowerCase(),
    pageSize: PAGE_SIZE
  });

  const data = useMemo(() => {
    return list || [];
  }, [list]);

  const renderCell = (item: CollatorSet, columnKey: Key) => {
    const cellValue = item[columnKey as keyof CollatorSet];

    switch (columnKey) {
      case 'collator':
        return <AddressCard address={item.address as `0x${string}`} />;
      case 'balance': {
        const formattedBalance = formatEther(item.assets ? BigInt(item.assets) : 0n);
        return (
          <FormattedNumberTooltip value={formattedBalance} className="line-clamp-1">
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

      default:
        return null;
    }
  };

  useEffect(() => {
    return () => {
      setPage(1);
      setKeyword('');
    };
  }, [setKeyword]);

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
        onClear={resetKeyword}
        onValueChange={handleValueChange}
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
            'overflow-auto max-h-[50vh] rounded-medium p-0 shadow-none bg-background dark:bg-secondary',
          td: 'text-foreground'
        }}
        bottomContent={
          page === 1 && data?.length < PAGE_SIZE ? null : (
            <div className="flex w-full justify-end gap-2">
              <Button
                size="sm"
                variant="flat"
                color="default"
                isDisabled={page === 1}
                onPress={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="default"
                isDisabled={data?.length < PAGE_SIZE}
                onPress={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )
        }
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
        </TableHeader>
        <TableBody
          items={data || []}
          loadingContent={
            <div className="absolute inset-0 flex w-full items-center justify-center bg-background/50">
              <Spinner />
            </div>
          }
          emptyContent={<div className="text-center">No records</div>}
          loadingState={isLoading || isPending ? 'loading' : 'idle'}
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
export default CollatorWaitingSelectionTable;
