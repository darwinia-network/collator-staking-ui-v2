import { useState, useCallback } from 'react';
import { useDebounce } from 'react-use';

interface UseDebouncedStateProps<T> {
  initialValue: T;
  delay?: number;
}

interface UseDebouncedStateReturn<T> {
  value: T;
  debouncedValue: T;
  isLoading: boolean;
  setValue: (value: T) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}

export function useDebouncedState<T>({
  initialValue,
  delay = 300
}: UseDebouncedStateProps<T>): UseDebouncedStateReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(value);
      setIsLoading(false);
    },
    delay,
    [value]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      cancel();
      setIsLoading(true);
      setValue(e.target.value as unknown as T);
    },
    [cancel]
  );

  const reset = useCallback(() => {
    setValue(initialValue);
    setDebouncedValue(initialValue);
    setIsLoading(false);
  }, [initialValue]);

  return { value, debouncedValue, isLoading, setValue, handleChange, reset };
}
