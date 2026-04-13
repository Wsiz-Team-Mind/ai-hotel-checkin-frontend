export type ApiErrorKind = 'network' | 'timeout' | 'server' | 'client' | 'parse' | 'unknown';

export interface ApiErrorPayload {
  message: string;
  status?: number;
  kind?: ApiErrorKind;
  details?: unknown;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly kind: ApiErrorKind;
  readonly details?: unknown;

  constructor({ message, status, kind = 'unknown', details, cause }: ApiErrorPayload) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = 'ApiError';
    this.status = status;
    this.kind = kind;
    this.details = details;
  }

  get userMessage(): string {
    switch (this.kind) {
      case 'network':
        return 'Network connection problem. Please check your internet and try again.';
      case 'timeout':
        return 'The request took too long. Please try again.';
      case 'server':
        return this.message || 'Something went wrong on our side. Please try again later.';
      case 'client':
        return this.message || 'The request could not be completed.';
      case 'parse':
        return 'We received an unexpected response from the server.';
      default:
        return this.message || 'Unexpected error occurred.';
    }
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  if (error instanceof Error) {
    return new ApiError({ message: error.message, kind: 'unknown', cause: error });
  }
  return new ApiError({ message: 'Unexpected error occurred.', kind: 'unknown', cause: error });
}
