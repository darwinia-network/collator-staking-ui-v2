import { useState, useCallback, useEffect } from 'react';
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

  useDebounce(
    () => {
      setDebouncedValue(value);
      setIsLoading(false);
    },
    delay,
    [value]
  );

  useEffect(() => {
    if (value !== debouncedValue) {
      setIsLoading(true);
    }
  }, [value, debouncedValue]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setDebouncedValue(initialValue);
    setIsLoading(false);
  }, [initialValue]);

  return { value, debouncedValue, isLoading, setValue, handleChange, reset };
}
