import { useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { cn, ScrollShadow } from '@nextui-org/react';

import Empty from '@/components/empty';
import { MAX_DOM_COUNT } from '@/config/site';

interface VirtualListProps<T> {
  data?: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemSize: number;
  itemGap?: number;
  maxItemCount?: number;
  scrollShadowClassName?: string;
  isLoading?: boolean;
  emptyLabel: string;
  loadingComponent: React.ReactNode;
  onItemEvent?: (item: T) => void;
}

function VirtualList<T>({
  data,
  renderItem,
  itemSize,
  scrollShadowClassName,
  itemGap = 10,
  maxItemCount = 4,
  isLoading = false,
  emptyLabel,
  loadingComponent
}: VirtualListProps<T>) {
  const totalHeight = useMemo(() => {
    if (!data) return 0;
    if (data.length < maxItemCount) {
      return data.length * itemSize + data.length * itemGap;
    }
    return (itemSize + itemGap) * maxItemCount;
  }, [data, itemSize, itemGap, maxItemCount]);

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = data?.[index];
      return item ? (
        <div
          style={{
            ...style,
            paddingRight: 'var(--scrollbar-gap)'
          }}
        >
          {renderItem(item, index)}
        </div>
      ) : null;
    },
    [data, renderItem]
  );

  if (isLoading) return loadingComponent;

  if (!data?.length) return <Empty label={emptyLabel} />;

  if (data.length <= MAX_DOM_COUNT) {
    return (
      <ScrollShadow
        hideScrollBar
        className={cn('w-full', scrollShadowClassName)}
        size={20}
        style={{
          maxHeight: totalHeight,
          gap: `${itemGap}px`
        }}
      >
        {data.map((item, index) => (
          <div key={index} style={{ marginBottom: index < data.length - 1 ? itemGap : 0 }}>
            {renderItem(item, index)}
          </div>
        ))}
      </ScrollShadow>
    );
  }

  return (
    <List height={totalHeight} itemCount={data.length} itemSize={itemSize + itemGap} width="100%">
      {Row}
    </List>
  );
}

export default VirtualList;
