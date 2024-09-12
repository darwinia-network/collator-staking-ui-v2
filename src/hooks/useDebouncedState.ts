import { useState, useCallback } from 'react';
import { useDebounce } from 'react-use';

interface UseDebouncedStateProps<T> {
  initialValue: T;
  delay?: number;
}

interface UseDebouncedStateReturn<T> {
  value: T;
  debouncedValue: T;
  setValue: (value: T) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}

export function useDebouncedState<T>({
  initialValue,
  delay = 500
}: UseDebouncedStateProps<T>): UseDebouncedStateReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(value);
    },
    delay,
    [value]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      cancel();
      setValue(e.target.value as unknown as T);
    },
    [cancel]
  );

  const reset = useCallback(() => {
    setValue(initialValue);
    setDebouncedValue(initialValue);
  }, [initialValue]);
  return { value, debouncedValue, setValue, handleChange, reset };
}
