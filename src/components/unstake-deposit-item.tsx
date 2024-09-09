import { Checkbox, Progress, Tooltip } from '@nextui-org/react';

import type { StakedDepositInfo } from '@/view/stake/_hooks/staked';
import { formatNumericValue } from '@/utils';
import { formatEther } from 'viem';
import dayjs from 'dayjs';

interface DepositItemProps {
  item: StakedDepositInfo;
  isChecked?: boolean;
  symbol?: string;
  onChange: (id: bigint) => void;
}

const DepositItem = ({ item, isChecked, symbol, onChange }: DepositItemProps) => {
  const formattedValue = formatNumericValue(formatEther(item?.amount || 0n), 3);
  const startAtDate = dayjs(item?.startAt * 1000).format('YYYY-MM-DD');
  const endAtDate = dayjs(item?.endAt * 1000).format('YYYY-MM-DD');
  const now = dayjs().unix();
  const totalDuration = item?.endAt - item?.startAt;
  const elapsedDuration = Math.max(0, Math.min(now - item?.startAt, totalDuration));
  const progressValue = (elapsedDuration / totalDuration) * 100;
  return (
    <Tooltip closeDelay={0} content={`${startAtDate} - ${endAtDate}`} placement="bottom">
      <div
        className="flex cursor-pointer items-start gap-[0.31rem]"
        onClick={() => {
          onChange(item?.tokenId);
        }}
      >
        <Checkbox
          isSelected={isChecked}
          radius="full"
          className="-mt-[3px]"
          onValueChange={() => {
            onChange(item?.tokenId);
          }}
          classNames={{
            label: 'text-foreground text-[0.875rem] font-normal '
          }}
        ></Checkbox>
        <Progress
          classNames={{
            label: 'w-full'
          }}
          label={
            <div className="flex w-full items-center justify-between">
              <span className="text-[0.875rem] font-normal text-foreground">
                ID# {item?.tokenId?.toString()}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[0.875rem] font-normal text-foreground">
                  {formattedValue.fixed}
                </span>
                <span className="text-[0.875rem] font-normal text-foreground">{symbol || ''}</span>
              </div>
            </div>
          }
          value={progressValue}
          className="w-full gap-1"
          size="sm"
          color="primary"
        />
      </div>
    </Tooltip>
  );
};

export default DepositItem;
