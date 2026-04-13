import { ApiError } from './ApiError';

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeoutMs?: number;
  baseUrl?: string;
}

const DEFAULT_TIMEOUT_MS = 15_000;

function resolveUrl(path: string, baseUrl?: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? '';
  if (!base) return path;
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (cause) {
      throw new ApiError({
        message: 'Failed to parse server response.',
        kind: 'parse',
        status: response.status,
        cause,
      });
    }
  }
  return response.text();
}

function extractServerMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (typeof record.message === 'string') return record.message;
    if (typeof record.error === 'string') return record.error;
  }
  return fallback;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, timeoutMs = DEFAULT_TIMEOUT_MS, baseUrl, headers, signal, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  const init: RequestInit = {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: controller.signal,
  };

  let response: Response;
  try {
    response = await fetch(resolveUrl(path, baseUrl), init);
  } catch (cause) {
    if (controller.signal.aborted) {
      throw new ApiError({ message: 'Request timed out.', kind: 'timeout', cause });
    }
    throw new ApiError({ message: 'Network request failed.', kind: 'network', cause });
  } finally {
    window.clearTimeout(timeoutId);
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    const kind = response.status >= 500 ? 'server' : 'client';
    const fallback =
      response.status >= 500
        ? 'Server error. Please try again later.'
        : 'Request failed. Please check your input and try again.';
    throw new ApiError({
      message: extractServerMessage(payload, fallback),
      status: response.status,
      kind,
      details: payload,
    });
  }

  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
