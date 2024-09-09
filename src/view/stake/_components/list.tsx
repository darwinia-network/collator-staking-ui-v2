import { useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ScrollShadow } from '@nextui-org/react';
import { MAX_DOM_COUNT, MAX_ITEM_COUNT } from '@/config/site';
import Empty from '@/components/empty';
import StakeLoading from './loading';
import Item from './item';

import type { StakingAccountWithStatus } from '@/hooks/useStakingAccountWithStatus';

interface StakeListProps {
  data?: StakingAccountWithStatus[];
  onClick: (item: StakingAccountWithStatus) => void;
  isLoading: boolean;
}

const itemSize = 82;
const itemGap = 10;

const StakeList = ({ data, isLoading, onClick }: StakeListProps) => {
  const totalHeight = useMemo(() => {
    if (!data) return 0;
    if (data?.length < 4) {
      return data?.length * itemSize + data?.length * itemGap;
    }
    return (itemSize + itemGap) * MAX_ITEM_COUNT;
  }, [data]);

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = data?.[index];
      if (!item) return null;
      return (
        <Item
          key={item.id}
          item={item}
          onClick={() => onClick(item)}
          style={{
            ...style,
            paddingRight: 'var(--scrollbar-gap)'
          }}
        />
      );
    },
    [data, onClick]
  );
  if (isLoading) {
    return <StakeLoading />;
  }

  if (!data?.length) {
    return <Empty label="No Stake" />;
  }

  if (data.length <= MAX_DOM_COUNT) {
    return (
      <ScrollShadow
        hideScrollBar
        className="w-full space-y-[0.62rem]"
        size={20}
        style={{
          maxHeight: totalHeight
        }}
      >
        {data.map((item) => (
          <Item key={item.id} item={item} onClick={() => onClick(item)} />
        ))}
      </ScrollShadow>
    );
  }
  return (
    <List
      height={totalHeight}
      itemCount={data.length}
      itemSize={itemSize + itemGap}
      width={'100%'}
      className="pr-[var(--scrollbar-gap)]"
    >
      {Row}
    </List>
  );
};

export default StakeList;
