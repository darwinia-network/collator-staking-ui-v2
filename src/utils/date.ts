import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import utc from 'dayjs/plugin/utc.js';

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

const toTimestampMs = (input: number | string | Date): number | null => {
  if (input instanceof Date) {
    return input.getTime();
  }

  if (typeof input === 'string') {
    if (input.trim() === '') {
      return null;
    }
    const numericValue = Number(input);
    if (Number.isNaN(numericValue)) {
      return null;
    }
    return numericValue > 1e12 ? numericValue : numericValue * 1000;
  }

  if (typeof input === 'number') {
    if (!Number.isFinite(input)) {
      return null;
    }
    return input > 1e12 ? input : input * 1000;
  }

  return null;
};

export const formatRelativeTimeShort = (input?: number | string | Date | null): string => {
  if (input === null || input === undefined) {
    return '-';
  }

  const timestampMs = toTimestampMs(input);

  if (!timestampMs) {
    return '-';
  }

  const diff = Date.now() - timestampMs;

  if (diff <= 0) {
    return 'now';
  }

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) {
    return 'now';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  if (days < 2) {
    return '1d';
  }

  if (days < 7) {
    return `${days}d`;
  }

  if (days < 14) {
    return '1w';
  }

  if (days < 28) {
    const weeks = Math.floor(days / 7);
    return `${weeks}w`;
  }

  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${Math.max(months, 1)}mo`;
  }

  const years = Math.floor(days / 365);
  return `${years}y`;
};

export default dayjs;
