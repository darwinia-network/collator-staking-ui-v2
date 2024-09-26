import { Checkbox, Progress, Tooltip } from '@nextui-org/react';
import { formatEther } from 'viem';
import FormattedNumberTooltip from './formatted-number-tooltip';

import type { StakedDepositInfo } from '@/view/stake/_hooks/staked';
import { calculateDepositProgress } from '@/utils/date';

interface UnstakeDepositItemProps {
  item: StakedDepositInfo;
  isChecked?: boolean;
  isDisabled?: boolean;
  symbol?: string;
  onChange: (id: bigint) => void;
}

const UnstakeDepositItem = ({
  item,
  isChecked,
  isDisabled,
  symbol,
  onChange
}: UnstakeDepositItemProps) => {
  const value = formatEther(item?.amount || 0n);

  const { startAtDate, endAtDate, progressValue } = calculateDepositProgress(
    item?.startAt,
    item?.endAt
  );

  return (
    <Tooltip closeDelay={0} content={`${startAtDate} - ${endAtDate}`} placement="bottom">
      <div
        className="flex cursor-pointer items-start gap-[0.31rem]"
        onClick={() => {
          if (isDisabled) return;
          onChange(item?.tokenId);
        }}
      >
        <Checkbox
          isSelected={isChecked}
          isDisabled={isDisabled}
          radius="full"
          className="-mt-[3px]"
          onValueChange={() => {
            if (isDisabled) return;
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
                Token ID [{item?.tokenId?.toString()}]
              </span>
              <div className="flex items-center gap-2">
                <FormattedNumberTooltip value={value}>
                  {(formattedValue) => (
                    <span className="text-[0.875rem] font-normal text-foreground">
                      {formattedValue}
                    </span>
                  )}
                </FormattedNumberTooltip>

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

export default UnstakeDepositItem;
