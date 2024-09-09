import React, { useCallback, useMemo } from 'react';
import { ScrollShadow } from '@nextui-org/react';
import { FixedSizeList as List } from 'react-window';

import Empty from '@/components/empty';
import ClaimLoading from './loading';
import { MAX_DOM_COUNT, MAX_ITEM_COUNT } from '@/config/site';

import Item from './item';
import type { ClaimableReward } from './item';

const itemSize = 82;
const itemGap = 20;

interface StakeListProps {
  data?: ClaimableReward[];
  onClick: (item: ClaimableReward) => void;
  isLoading: boolean;
  rewardIsLoading: boolean;
}

const ClaimList = ({ data, isLoading, rewardIsLoading, onClick }: StakeListProps) => {
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
      return (
        item && (
          <Item
            key={item?.id}
            reward={item}
            rewardIsLoading={rewardIsLoading}
            onClick={() => onClick(item)}
            style={{
              ...style,
              paddingRight: 'var(--scrollbar-gap)'
            }}
          />
        )
      );
    },
    [data, onClick, rewardIsLoading]
  );
  if (isLoading) {
    return <ClaimLoading />;
  }

  if (!data?.length) {
    return <Empty label="No Claim" />;
  }

  if (data.length <= MAX_DOM_COUNT) {
    return (
      <ScrollShadow
        hideScrollBar
        className="w-full space-y-[1.25rem]"
        size={20}
        style={{
          maxHeight: totalHeight
        }}
      >
        {data.map((item) => (
          <Item
            key={item.id}
            reward={item}
            rewardIsLoading={rewardIsLoading}
            onClick={() => onClick(item)}
          />
        ))}
      </ScrollShadow>
    );
  }
  return (
    <List height={totalHeight} itemCount={data.length} itemSize={itemSize + itemGap} width={'100%'}>
      {Row}
    </List>
  );
};

export default ClaimList;
