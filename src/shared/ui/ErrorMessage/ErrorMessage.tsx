import type { HTMLAttributes, ReactNode } from 'react';
import { isApiError, toApiError } from '@/shared/api';
import { Button } from '@/shared/ui/Button';
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  error: unknown;
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
  compact?: boolean;
  children?: ReactNode;
}

function resolveMessage(error: unknown): { title: string; body: string } {
  if (typeof error === 'string') {
    return { title: 'Something went wrong', body: error };
  }
  const apiError = isApiError(error) ? error : toApiError(error);
  const titleByKind: Record<string, string> = {
    network: 'Connection problem',
    timeout: 'Request timed out',
    server: 'Server error',
    client: 'Request failed',
    parse: 'Unexpected response',
    unknown: 'Something went wrong',
  };
  return {
    title: titleByKind[apiError.kind] ?? 'Something went wrong',
    body: apiError.userMessage,
  };
}

export function ErrorMessage({
  error,
  title,
  onRetry,
  retryLabel = 'Try again',
  compact = false,
  className = '',
  children,
  ...props
}: ErrorMessageProps) {
  const resolved = resolveMessage(error);
  const containerClass = [styles.container, compact ? styles['container--compact'] : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClass} role="alert" {...props}>
      <div className={styles.body}>
        <strong className={styles.title}>{title ?? resolved.title}</strong>
        <p className={styles.text}>{resolved.body}</p>
        {children ? <div className={styles.extra}>{children}</div> : null}
      </div>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry} className={styles.retry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
