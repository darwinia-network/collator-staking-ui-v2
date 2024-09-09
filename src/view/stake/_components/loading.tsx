import { Skeleton } from '@nextui-org/react';

import { MAX_ITEM_COUNT } from '@/config/site';

export default function Loading({ count = MAX_ITEM_COUNT }: { count?: number }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-[0.62rem] rounded-medium">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} className="h-[4.4375rem] w-full rounded-medium" />
        ))}
    </div>
  );
}
