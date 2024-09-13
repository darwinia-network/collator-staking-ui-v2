import { Checkbox, Progress, Tooltip } from '@nextui-org/react';
import dayjs from 'dayjs';
import { formatEther } from 'viem';
import FormattedNumberTooltip from './formatted-number-tooltip';
import type { DepositInfo } from '@/hooks/useUserDepositDetails';

interface DepositItemProps {
  item: DepositInfo;
  isChecked?: boolean;
  symbol?: string;
  onChange: (id: bigint) => void;
}

const DepositItem = ({ item, isChecked, symbol, onChange }: DepositItemProps) => {
  const value = formatEther(item?.value || 0n);
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

export default DepositItem;
