import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, toApiError } from '@/shared/api';

export interface UseApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isSuccess: boolean;
  refetch: () => void;
  reset: () => void;
}

interface UseApiOptions {
  enabled?: boolean;
  deps?: ReadonlyArray<unknown>;
}

export function useApi<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  { enabled = true, deps = [] }: UseApiOptions = {},
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const runIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const runId = ++runIdRef.current;

    setIsLoading(true);
    setError(null);

    fetcherRef
      .current(controller.signal)
      .then((result) => {
        if (runId !== runIdRef.current) return;
        setData(result);
        setIsSuccess(true);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (runId !== runIdRef.current) return;
        setError(toApiError(err));
        setIsSuccess(false);
      })
      .finally(() => {
        if (runId !== runIdRef.current) return;
        setIsLoading(false);
      });
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    runIdRef.current++;
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsSuccess(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    execute();
    return () => {
      controllerRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, execute, ...deps]);

  return { data, error, isLoading, isSuccess, refetch: execute, reset };
}
