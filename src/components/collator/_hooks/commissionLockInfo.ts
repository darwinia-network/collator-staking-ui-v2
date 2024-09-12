import { useMemo } from 'react';
import { useCommissionLocks } from './commissionLocks';

export function useCommissionLockInfo() {
  const { isLockPeriod, isLoading: isLockPeriodLoading, lockEndTime } = useCommissionLocks();

  const remainingLockTime = useMemo(() => {
    if (!lockEndTime) return '';
    const now = Math.floor(Date.now() / 1000);
    const end = Number(lockEndTime);
    const diffInSeconds = end - now;
    const diffInDays = Math.ceil(diffInSeconds / (24 * 60 * 60));
    const rtf = new Intl.RelativeTimeFormat('en', { style: 'short' });
    return rtf.format(diffInDays, 'day');
  }, [lockEndTime]);

  return {
    isLockPeriod,
    isLockPeriodLoading,
    remainingLockTime
  };
}
