import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

dayjs.extend(duration);
dayjs.extend(utc);

export function calculateDepositProgress(
  startAt: number,
  endAt: number
): {
  startAtDate: string;
  endAtDate: string;
  progressValue: number;
} {
  const startAtDate = dayjs(startAt * 1000).format('YYYY-MM-DD');
  const endAtDate = dayjs(endAt * 1000).format('YYYY-MM-DD');
  const now = dayjs().unix();
  const totalDuration = endAt - startAt;
  const elapsedDuration = Math.max(0, Math.min(now - startAt, totalDuration));
  const progressValue = (elapsedDuration / totalDuration) * 100;

  return { startAtDate, endAtDate, progressValue };
}

export default dayjs;
