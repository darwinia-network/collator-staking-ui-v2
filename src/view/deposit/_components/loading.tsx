import { Skeleton } from '@nextui-org/react';

export default function Loading() {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-5">
        <Skeleton className="h-[4.4375rem] w-full rounded-medium" />
        <Skeleton className="h-[4.4375rem] w-full rounded-medium" />
        <Skeleton className="h-[4.4375rem] w-full rounded-medium" />
      </div>
    </>
  );
}
