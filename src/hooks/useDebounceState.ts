import { useState, useCallback } from 'react';
import { useDebounce } from 'react-use';

function useDebounceState<T>(initialValue: T, delay: number = 500): [T, T, (value: T) => void] {
  const [state, setState] = useState<T>(initialValue);
  const [debouncedState, setDebouncedState] = useState<T>(initialValue);

  useDebounce(
    () => {
      setDebouncedState(state);
    },
    delay,
    [state]
  );

  const setDebounceState = useCallback((value: T) => {
    setState(value);
  }, []);

  return [state, debouncedState, setDebounceState];
}

export default useDebounceState;
